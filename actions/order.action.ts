"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

const prisma = new PrismaClient();


//create order
export async function createOrder(userId: string, address: string, phone: number, total: number) {
    const order = await prisma.order.create({

        data: {
            userId,
            address,
            phone: phone,
            total,
            status: "PENDING",
        }
    });
    return order.id;
}


//add order items

export async function addOrderItems(
    orderId: string,
    productId: string,
    quantity: number,
    price: number
) {
    const orderItem = await prisma.orderItem.create({
        data: {
            orderId,
            productId,
            quantity,
            price,
        },
    });

    await prisma.product.update({
        where: { id: productId },
        data: {
            quantity: {
                set: (await prisma.product.findUnique({
                    where: { id: productId },
                    select: { quantity: true },
                }))!.quantity - quantity,
            },
        },
    });

    revalidatePath("/dashboard/orders");
    return orderItem;
}



export async function getOrdersByUserId(userId: string) {
    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            items: true,
        },
    });

    const ordersWithProducts = await Promise.all(
        orders.map(async (order) => {
            const itemsWithProducts = await Promise.all(
                order.items.map(async (item) => {
                    if (!item.productId) return null;

                    const product = await prisma.product.findUnique({
                        where: { id: item.productId },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            imageUrl: true,
                        },
                    });

                    if (!product) return null;

                    return { ...item, product };
                })
            );
            return { ...order, items: itemsWithProducts.filter(Boolean) };
        })
    );

    return ordersWithProducts;
}



export async function getOrdersForSeller(sellerId: string) {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, name: true, email: true },
            },
            items: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    productId: true, // نجيب فقط الـ productId
                },
            },
        },
    });

    const filteredOrders = [];

    for (const order of orders) {
        const itemsForSeller = [];

        for (const item of order.items) {
            if (!item.productId) continue;

            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) continue;

            const isSellerOwner = await prisma.brandOwner.findFirst({
                where: {
                    userId: sellerId,
                    brandId: product.brandId,
                },
            });
            if (isSellerOwner) {
                itemsForSeller.push({
                    ...item,
                    product: {
                        ...product,
                        createdAt: product.createdAt.toISOString(),
                        updatedAt: product.updatedAt.toISOString(),
                    },
                });
            }
        }

        if (itemsForSeller.length > 0) {
            filteredOrders.push({
                ...order,
                items: itemsForSeller,
                createdAt: order.createdAt.toISOString(),
            });
        }
    }

    return filteredOrders;
}


export async function getOrdersForAdmin(sellerId: string) {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    productId: true,
                },
            },
        },
    });

    const ordersWithProducts = [];

    for (const order of orders) {
        const itemsWithProduct = [];

        for (const item of order.items) {
            if (!item.productId) continue;

            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) continue; // skip if product deleted

            itemsWithProduct.push({
                ...item,
                product: {
                    ...product,
                    createdAt: product.createdAt.toISOString(),
                    updatedAt: product.updatedAt.toISOString(),
                },
            });
        }

        if (itemsWithProduct.length > 0) {
            ordersWithProducts.push({
                ...order,
                items: itemsWithProduct,
                createdAt: order.createdAt.toISOString(),
            });
        }
    }

    return ordersWithProducts;
}


export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        revalidatePath("/dashboard/orders");

        return updatedOrder;
    } catch (error) {
        console.error("Failed to update order status:", error);
        throw new Error("Could not update order status");
    }
}

export async function deleteOrderById(orderId: string) {
    try {
        const deletedOrder = await prisma.order.delete({
            where: { id: orderId },
        });
        revalidatePath("/dashboard/orders");
        return deletedOrder;
    } catch (error) {
        console.error("Failed to delete order:", error);
        throw new Error("Could not delete order");
    }
}