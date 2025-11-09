import { z } from "zod";


const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),

  price: z.coerce.number().min(1, {
    message: "Price must be at least 1.",
  }),

  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  image: z.instanceof(File),

  categoryId: z
    .string()
    .length(24, {
      message: "Invalid category ID format (must be 24 characters)",
    }),


  BrandId: z
    .string()
    .length(24, {
      message: "Invalid brand ID format (must be 24 characters)",
    }),
});

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),
});

export const brandFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  image: z.instanceof(File),
});

export const premiumAccountFormSchema = z.object({
  storeName: z
    .string()
    .min(3, { message: "Store name must be at least 3 characters" })
    .max(100, { message: "Store name must not exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),

  Phone: z.coerce.number().min(100000000, {
    message: "Phone number must be at least 10 digits",
  }
  ),

  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" })
    .max(200, { message: "Address must not exceed 200 characters" }),

  image: z
    .instanceof(File, { message: "Image is required." })
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});



export const OrderFormSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" })
    .max(150, { message: "Address must not exceed 100 characters" }),


  Phone: z.coerce.number().min(100000000, {
    message: "Phone number must be at least 10 digits",
  }
  ),

});

export const updateProductDataSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),

  price: z.coerce.number().min(1, {
    message: "Price must be at least 1.",
  }),

  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),

  categoryId: z
    .string()
    .length(24, {
      message: "Invalid category ID format (must be 24 characters)",
    }),


  BrandId: z
    .string()
    .length(24, {
      message: "Invalid brand ID format (must be 24 characters)",
    }),
});

export const updateProductImageSchema = z.object({
  image: z.any().refine((file) => file instanceof File, "Image file is required."),
});

export const heroSlideFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  href: z.string().optional(),
  order: z.number().min(1, "الترتيب يجب أن يكون رقم موجب"),
  isActive: z.boolean().default(true),
  imageUrl: z.any().optional(),
});

export const heroSlideTextSchema = z.object({
  title: z.string().min(3, { message: "العنوان يجب أن يكون 3 أحرف على الأقل." }),
  subtitle: z.string().min(5, { message: "العنوان الفرعي يجب أن يكون 5 أحرف على الأقل." }),
  buttonText: z.string().min(2, { message: "نص الزر يجب أن يكون حرفين على الأقل." }),
  href: z.string().url({ message: "الرجاء إدخال رابط صالح." }),
  order: z.coerce.number().int().positive({ message: "الترتيب يجب أن يكون رقمًا صحيحًا موجبًا." }),
  isActive: z.boolean().default(true),
});

export const heroSlideImageSchema = z.object({
  imageUrl: z.any().refine((file) => file instanceof File, "الصورة مطلوبة."),
});