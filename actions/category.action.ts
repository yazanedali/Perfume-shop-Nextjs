"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";


const prisma = new PrismaClient();

export const getCategoryListActions = async () => {


    return await prisma.category.findMany({
        orderBy: {
            name: "desc",
        },
    });
};

export const createCategoryActions = async ({ name }: { name: string }) => {
    await prisma.category.create({
        data: {
            name,
        },
    });
    revalidatePath("/");
};

export const getCategoryByIdAction = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    return null;
  }
};