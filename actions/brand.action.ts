"use server";
import { IBrand, Seller } from "@/interfaces";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const getBrandListActions = async () => {
    return await prisma.brand.findMany({
        orderBy: {
            name: "desc",
        },
    });
};

export const getBrandsByOwnerIdActions = async (ownerId: string) => {
    const brands = await prisma.brand.findMany({
        where: {
            brandOwners: {
                some: {
                    userId: ownerId, // بنفلتر حسب الـ userId في BrandOwner
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    return brands;
};


export const createBrandActions = async ({
    name,
    logoUrl,
    ownerId,
}: IBrand) => {
    let existingBrand = await prisma.brand.findFirst({
        where: {
            name: {
                equals: name,
                mode: "insensitive",
            },
        },
    });

    if (existingBrand) {
        // تحقق هل الربط موجود
        const existingLink = await prisma.brandOwner.findFirst({
            where: {
                brandId: existingBrand.id,
                userId: ownerId,
            },
        });

        if (!existingLink) {
            await prisma.brandOwner.create({
                data: {
                    brandId: existingBrand.id,
                    userId: ownerId,
                },
            });
        }

        return existingBrand;
    }

    const newBrand = await prisma.brand.create({
        data: {
            name,
            logoUrl,
        },
    });

    await prisma.brandOwner.create({
        data: {
            brandId: newBrand.id,
            userId: ownerId,
        },
    });

    revalidatePath("/");

    return newBrand;
};

export const getSellers = async () => {
    const sellers = await prisma.user.findMany({
        where: { role: "SELLER" },
        include: {
            brandOwners: {
                include: {
                    brand: {
                        include: {
                            products: true,
                        },
                    },
                },
            },
            sellerRequests: {
                select: {
                    logoUrl: true,
                },
                take: 1,
                orderBy: { createdAt: "desc" },
            },
        },
    });

    return sellers.map((seller: Seller) => ({
        sellerName: seller.name,
        sellerEmail: seller.email,
        productLimit: seller.productLimit,
        brandCount: seller.brandOwners.length,
        productCount: seller.brandOwners.reduce(
            (sum, bo) => sum + bo.brand.products.length,
            0
        ),
        ownerLogo: seller.sellerRequests[0]?.logoUrl ?? null,
    }));
};


export const getBrandByIdAction = async (id: string) => {
    try {
        const brand = await prisma.brand.findUnique({
            where: { id },
        });
        return brand;
    } catch (error) {
        return null;
    }
};


export async function getSellersWithDetails() {
  try {
    const sellers = await prisma.user.findMany({
      where: {
        role: "SELLER"
      },
      include: {
        sellerRequests: {
          where: {
            status: "APPROVED" // فقط الطلبات المقبولة
          },
          take: 1 // خذ أحدث طلب مقبول
        },
        brandOwners: {
          include: {
            brand: {
              include: {
                products: true
              }
            }
          }
        },
        products: true
      }
    });

    const sellersWithDetails = sellers.map(seller => {
      const sellerRequest = seller.sellerRequests[0]; // أحدث طلب مقبول
      const totalBrands = seller.brandOwners.length;
      const totalProducts = seller.products.length;

      return {
        sellerName: seller.name,
        sellerEmail: seller.email,
        productLimit: seller.productLimit,
        brandCount: totalBrands,
        productCount: totalProducts,
        ownerLogo: sellerRequest?.logoUrl || null,
        // البيانات من SellerRequest
        companyName: sellerRequest?.name || seller.name,
        description: sellerRequest?.description || null,
        address: sellerRequest?.address || null,
        phone: sellerRequest?.phone ? String(sellerRequest.phone) : null,
        createdAt: seller.createdAt,
        // بيانات إضافية
        userId: seller.id,
        requestStatus: sellerRequest?.status || null
      };
    });

    return sellersWithDetails;
  } catch (error) {
    console.error("Error fetching sellers with details:", error);
    return [];
  }
}