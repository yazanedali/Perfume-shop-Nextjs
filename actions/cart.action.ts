"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";


const prisma = new PrismaClient();


// addToCart(userId, productId, quantity)

export async function addToCart(userId: string, productId: string, quantity: number) {
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
        });
    }

    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId },
    });

    let result;

    if (existingItem) {
        result = await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
        });
    } else {
        result = await prisma.cartItem.create({
            data: { cartId: cart.id, productId, quantity },
        });
    }

    revalidatePath("/");

    return result;
}




// getCart(userId)
export async function getCart(userId: string) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: true,
                            brand: true,
                        },
                    },
                },
            },
        },
    });

    return cart;
}

// clearCart(userId)
export async function clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (cart) {
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }

    revalidatePath("/cart");
}


//deleteCartItem(userId, productId)
export async function deleteCartItem(userId: string, Id: string) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (cart) {
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                id: Id,

            },
        });
    }

    revalidatePath("/cart");
}

//counterCartItems(userId)
export async function counterCartItems(userId: string) {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: true,
        },
    });

    return cart?.items.length || 0;
}
