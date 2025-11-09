"use server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { HeroSlide } from "@/interfaces";

const prisma = new PrismaClient();

type UpdateHeroSlidePayload = Omit<HeroSlide, 'createdAt' | 'id'> & { id: string };
type CreateHeroSlideInput = Omit<HeroSlide, 'id' | 'createdAt'>;


export const createHeroSlideAction = async (data: CreateHeroSlideInput) => {
    try {
        await prisma.heroSlide.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                imageUrl: data.imageUrl,
                buttonText: data.buttonText,
                href: data.href,
                isActive: data.isActive,
                order: data.order,
            },
        });
        // إعادة تحميل البيانات في الصفحة الرئيسية وصفحة الإدارة
        revalidatePath('/');
        revalidatePath('/carousel-management');

        return { success: true, message: 'تم إنشاء الشريحة بنجاح.' };
    } catch (error) {
        console.error("Failed to create hero slide:", error);
        return { success: false, message: 'فشل في إنشاء الشريحة.' };
    }
};

export const getActiveHeroSlidesAction = async () => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true, 
      },
      orderBy: {
        order: 'asc', 
      },
    });
    return slides;
  } catch (error) {
    console.error("Failed to fetch active hero slides:", error);
    return []; 
  }
};

export const getAllHeroSlidesAction = async () => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: {
        order: 'asc', 
      },
    });
    return slides;
  } catch (error) {
    console.error("Failed to fetch all hero slides:", error);
    return []; 
  }
};

export const getHeroSlideByIdAction = async (id: string) => {
    try {
        const slide = await prisma.heroSlide.findUnique({
            where: { id },
        });
        return slide;
    } catch (error) {
        console.error("Failed to fetch hero slide by ID:", error);
        return null;
    }
};


export const deleteHeroSlideAction = async (id: string) => {
    try {
        await prisma.heroSlide.delete({
            where: { id },
        });
        revalidatePath('/');
        revalidatePath('/carousel-management');
        return { success: true, message: 'Slide deleted successfully.' };
    } catch (error) {
        console.error("Failed to delete hero slide:", error);
        return { success: false, message: 'Failed to delete slide.' };
    }
};

export const updateHeroSlideAction = async (data: UpdateHeroSlidePayload) => {
    const { id, title, subtitle, imageUrl, buttonText, href, isActive, order } = data;

    // التحقق من صلاحية البيانات هنا (اختياري لكن موصى به)

    try {
        await prisma.heroSlide.update({
            where: { id },
            data: {
                title,
                subtitle,
                imageUrl,
                buttonText,
                href,
                isActive,
                order,
            },
        });
        revalidatePath('/');
        revalidatePath('/carousel-management');
        revalidatePath(`/carousel-management/edit/${id}`);

        return { success: true, message: 'Slide updated successfully.' };
    } catch (error) {
        console.error("Failed to update hero slide:", error);
        return { success: false, message: 'Failed to update slide.' };
    }
};

export const updateHeroSlideInfoAction = async (data: {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  href: string;
  isActive: boolean;
  order: number;
}) => {  
  const { id, title, subtitle, buttonText, href, isActive, order } = data;

  try {
    // التحقق من وجود السلايد أولاً
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      console.error("❌ Slide not found:", id);
      return { success: false, message: 'الشريحة غير موجودة.' };
    }

    
    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        title,
        subtitle,
        buttonText,
        href,
        isActive,
        order: parseInt(order as any),
      },
    });


    revalidatePath('/');
    revalidatePath('/carousel-management');

    return { success: true, message: 'تم تحديث معلومات الشريحة بنجاح.' };
  } catch (error: any) {
    console.error("❌ Failed to update hero slide info:", error);
    return { success: false, message: 'فشل في تحديث المعلومات: ' + error.message };
  }
};

export const updateHeroSlideImageAction = async (data: {
  id: string;
  imageUrl: string;
}) => {
  console.log("🖼️ Received image update data:", data);
  
  const { id, imageUrl } = data;

  try {
    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existingSlide) {
      return { success: false, message: 'الشريحة غير موجودة.' };
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data: {
        imageUrl,
      },
    });

    revalidatePath('/');
    revalidatePath('/carousel-management');

    return { success: true, message: 'تم تحديث الصورة بنجاح.' };
  } catch (error: any) {
    console.error("❌ Failed to update hero slide image:", error);
    return { success: false, message: 'فشل في تحديث الصورة: ' + error.message };
  }
};