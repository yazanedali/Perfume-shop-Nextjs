// app/[locale]/my-products/EditProductDataForm.tsx
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProductDataSchema } from "@/schema"; // استخدام المخطط الجديد
import Spinner from "@/components/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProduct } from "@/actions/product.action";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ICategory {
  id: string;
  name: string;
}

interface OwnerBrand {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: string;
  brandId: string;
}

interface EditProductDataFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductFormData | null;
  categories: ICategory[];
  brands: OwnerBrand[];
  onProductUpdated: () => void;
}

export const EditProductDataForm = ({
  isOpen,
  onOpenChange,
  product,
  categories,
  brands,
  onProductUpdated,
}: EditProductDataFormProps) => {
  const t = useTranslations("MyProductsPage");

  const [loading, setLoading] = useState(false);


    const form = useForm({
      resolver: zodResolver(updateProductDataSchema),
      defaultValues: {
         name: "",
      description: "",
      price: undefined,
      quantity: undefined,
      categoryId: "",
      BrandId: "",
      },
      mode: "onChange",
    });

  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        categoryId: product.categoryId,
        BrandId: product.brandId,
      });
    } else {
      form.reset();
    }
  }, [product, isOpen, form]);

  const onSubmit = async (values: z.infer<typeof updateProductDataSchema>): Promise<void> => {
    if (!product) return;

    setLoading(true);

    try {
      const updateResult = await updateProduct({
        id: product.id,
        name: values.name,
        description: values.description,
        price: values.price,
        quantity: values.quantity,
        categoryId: values.categoryId,
        brandId: values.BrandId,
        // لا يتم تمرير imageUrl هنا
      });

      if (updateResult.success) {
        toast.success(t("updateDataSuccess"));
        onProductUpdated();
        onOpenChange(false);
      } else {
        throw new Error(updateResult.error || t("updateDataError"));
      }
    } catch (error: any) {
      console.error("Error updating product data:", error);
      toast.error(error.message || t("updateDataError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{t("editProductDataTitle")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("editProductDataDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("productNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("productDescriptionPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={t("productPricePlaceholder")}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : String(field.value)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder={t("productQuantityPlaceholder")}
                        {...field}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : String(field.value)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("category")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCategoryPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: ICategory) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="BrandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("brand")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectBrandPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand: OwnerBrand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner /> {t("saving")}
                    </>
                  ) : (
                    t("saveChanges")
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