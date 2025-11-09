// app/[locale]/my-products/EditProductImageForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProductImageSchema } from "@/schema"; // استخدام المخطط الجديد
import Spinner from "@/components/spinner";
import { updateProduct } from "@/actions/product.action";
import { toast } from "sonner";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface EditProductImageFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  currentImageUrl: string;
  onImageUpdated: () => void;
}

export const EditProductImageForm = ({
  isOpen,
  onOpenChange,
  productId,
  currentImageUrl,
  onImageUpdated,
}: EditProductImageFormProps) => {
  const t = useTranslations("MyProductsPage");

  const [loading, setLoading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(currentImageUrl);

  const form = useForm<z.infer<typeof updateProductImageSchema>>({
    resolver: zodResolver(updateProductImageSchema),
    defaultValues: {
      image: undefined,
    },
    mode: "onChange",
  });

  // إعادة تعيين النموذج والصورة المعاينة عند فتح/إغلاق الـ Dialog
  useEffect(() => {
    if (isOpen) {
      form.reset({ image: undefined });
      setPreviewImageUrl(currentImageUrl);
    } else {
      setPreviewImageUrl(null);
    }
  }, [isOpen, form, currentImageUrl]);

  // تحديث الصورة المعاينة عندما يختار المستخدم ملفًا جديدًا
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | undefined) => void) => {
    const file = e.target.files?.[0];
    onChange(file);
    if (file) {
      setPreviewImageUrl(URL.createObjectURL(file));
    } else {
      setPreviewImageUrl(currentImageUrl); // العودة إلى الصورة الأصلية إذا لم يتم اختيار ملف
    }
  };

  const onSubmit = async (values: z.infer<typeof updateProductImageSchema>): Promise<void> => {
    setLoading(true);

    try {
      let imageUrl = "";

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || t("imageUploadError"));

        imageUrl = data.url;
      } else {
        throw new Error(t("imageRequiredError")); // يجب أن يكون هناك ملف
      }

      const updateResult = await updateProduct({
        id: productId,
        imageUrl: imageUrl,
      });

      if (updateResult.success) {
        toast.success(t("updateImageSuccess"));
        onImageUpdated(); // استدعاء دالة التحديث
        onOpenChange(false);
      } else {
        throw new Error(updateResult.error || t("updateImageError"));
      }
    } catch (error: any) {
      console.error("Error updating product image:", error);
      toast.error(error.message || t("updateImageError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{t("editProductImageTitle")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("editProductImageDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormItem>
                <FormLabel>{t("currentImage")}</FormLabel>
                {previewImageUrl && (
                  <div className="relative w-48 h-48 rounded-md overflow-hidden border border-border flex items-center justify-center bg-muted">
                    <Image src={previewImageUrl} alt="Product Image Preview" fill className="object-cover" />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, ref, ...rest } }) => (
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={(e) => handleFileChange(e, onChange)}
                      />
                    </FormControl>
                  )}
                />
                <FormDescription>{t("imageUploadNewHint")}</FormDescription>
                <FormMessage />
              </FormItem>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner /> {t("uploadingImage")}
                    </>
                  ) : (
                    t("saveImage")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};