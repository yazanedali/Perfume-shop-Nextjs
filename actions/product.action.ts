"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { IProduct } from "@/interfaces";
import { getUserRole } from "@/lib/useUserRole";
const prisma = new PrismaClient();

export async function getProductListActions(searchTerm?: string, skip = 0, take = 10) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(searchTerm && {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })
    },
    orderBy: {
      name: "desc",
    },
    skip,
    take,
  include: {
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}


export async function getSellerProducts(userId: string) {
  // للتحقق من أن المستخدم موجود وبائع
  const seller = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!seller || seller.role !== "SELLER") {
    return []; // أو قم بإلقاء خطأ، حسب كيفية تعاملك مع الصلاحيات
  }

  return await prisma.product.findMany({
    where: {
      sellerId: userId,
    },
    include: {
      brand: {
        select: {
          id: true, // 👈 تم إضافة id هنا
          name: true,
        },
      },
      category: {
        select: {
          id: true, // 👈 تم إضافة id هنا
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductsByCategoryActions(
  categoryId: string,
  search: string = "",
  skip = 0,
  take = 10,
  brandId?: string
) {

  const where: any = {
    categoryId: categoryId,
    isActive: true,
  };


  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }


  if (brandId) {
    where.brandId = brandId;
  }

  return await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getProductsByBrandActions(
  brandId: string,
  search: string = "",
  skip = 0,
  take = 10,
  categoryId?: string
) {

  const where: any = {
    brandId: brandId,
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  return await prisma.product.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}


export const createProductActions = async ({
  name,
  description,
  price,
  imageUrl,
  quantity,
  categoryId,
  brandId,
  userId,
}: IProduct & { userId: string }) => {
  // 1. Fetch seller data
  const seller = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      brandOwners: {
        include: {
          brand: {
            include: { products: true },
          },
        },
      },
    },
  });

  if (!seller || seller.role !== "SELLER") {
    throw new Error("User is not a seller.");
  }

  // 2. Count total products owned by this seller
  const totalProducts = seller.brandOwners.reduce(
    (sum, bo) => sum + bo.brand.products.length,
    0
  );

  if (totalProducts >= seller.productLimit) {
    throw new Error("You have reached your maximum allowed number of products.");
  }

  // 3. Create the product
  await prisma.product.create({
    data: {
      name,
      description,
      price,
      imageUrl: imageUrl ?? "",
      quantity,
      categoryId,
      brandId,
      sellerId: userId,
        isActive: true,
    },
  });

  revalidatePath("/");
};

export async function getProductByIdAction(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
         id: productId ,
          isActive: true
        },
      include: {
        brand: {
          include: {
            brandOwners: {
              include: {
                user: true,
              },
            },
          },
        },
        category: true,
      },
    });

    if (!product) return null;

    // نفرض أنه البراند له مالك واحد أو أول مالك هو المطلوب
    const brandOwner = product.brand.brandOwners[0]?.user;

    let sellerRequest = null;
    if (brandOwner) {
      sellerRequest = await prisma.sellerRequest.findFirst({
        where: {
          userId: brandOwner.id,
          status: "APPROVED",
        },
      });
    }

    const productWithSellerDetails = {
      ...product,
      brand: {
        ...product.brand,
        owner: brandOwner
          ? {
            ...brandOwner,
            companyName: sellerRequest?.name || brandOwner.name,
            logoUrl: sellerRequest?.logoUrl || null,
            phone: sellerRequest?.phone || null,
            address: sellerRequest?.address || null,
            description: sellerRequest?.description || null,
          }
          : null,
      },
    };

    return productWithSellerDetails;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

interface IUpdateProduct {
  id: string; // معرف المنتج مطلوب للتعديل
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string; // جعلها اختيارية
  quantity?: number;
  categoryId?: string;
  brandId?: string;
}

export async function updateProduct(data: IUpdateProduct) {
  const { userId } = await getUserRole();

  if (!userId) {
    return { success: false, error: "Unauthorized: User not authenticated." };
  }

  try {
    const { id, ...updateData } = data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!existingProduct) {
      return { success: false, error: "Product not found." };
    }

    if (existingProduct.sellerId !== userId) {
      return { success: false, error: "Unauthorized: You do not own this product." };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/my-products");
    revalidatePath("/");

    return { success: true, product: updatedProduct };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message || "Failed to update product." };
  }
}

export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        isActive: true
      },
      include: {
        category: true,
        brand: true
      }
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

//update product limit for seller
export const updateProductLimit = async (email: string, newLimit: number) => {
  await prisma.user.update({
    where: { email },
    data: { productLimit: newLimit },
  });
  revalidatePath("/");
};


export async function deleteProduct(productId: string) {
  try {
    // soft delete باستخدام حقل isActive
    const product = await prisma.product.update({
      where: { id: productId },
      data: { 
        isActive: false,
        updatedAt: new Date() // تحديث تاريخ التعديل
      }
    })

    revalidatePath('/my-products')
    
    return { success: true, product }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { 
      success: false, 
      error: 'Failed to delete product' 
    }
  }
}