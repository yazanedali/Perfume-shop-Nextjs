"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ICategory, OwnerBrand } from "@/interfaces";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productFormSchema } from "@/schema";
import Spinner from "./spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createProductActions } from "@/actions/product.action";
import { useTranslations } from "next-intl";

const AddProductForm = ({
  categories,
  userId,
  brands,
}: {
  categories: ICategory[];
  userId: string | "";
  brands: OwnerBrand[];
}) => {
  const t = useTranslations("AddProductForm");
  const [loading, setLoading] = useState(false);
  const [Isclose, setIsclose] = useState(false);

  console.log("Categories:", categories);
  console.log("User ID:", userId);

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      quantity: 1,
      image: undefined,
      categoryId: "",
      BrandId: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (
    values: z.infer<typeof productFormSchema>
  ): Promise<void> => {
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

        if (!res.ok) throw new Error(data.error || t("uploadError"));

        imageUrl = data.url;
      }

      if (!brands || brands.length === 0) throw new Error(t("brandNotFound"));

      await createProductActions({
        name: values.name,
        description: values.description,
        price: values.price || 20,
        imageUrl,
        quantity: values.quantity || 1,
        categoryId: values.categoryId,
        brandId: values.BrandId,
        userId: userId as string,
      });

      setIsclose(false);
      // يمكنك إضافة toast للنجاح هنا إذا أردت
    } catch (error) {
      console.error(error);
      // يمكنك إضافة toast للخطأ هنا إذا أردت
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Isclose} onOpenChange={setIsclose}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center">
          <Plus className="mr-2" />
          {t("addProductButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("nameLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("namePlaceholder")} {...field} />
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
                    <FormLabel>{t("descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("descriptionPlaceholder")} {...field} />
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
                    <FormLabel>{t("priceLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder={t("pricePlaceholder")}
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
                name="image"
                render={({ field: { onChange, ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>{t("imageLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={(e) => onChange(e.target.files?.[0])}
                        // Do not spread rest here to avoid passing value prop
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
                    <FormLabel>{t("quantityLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("quantityPlaceholder")}
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
                    <FormLabel>{t("categoryLabel")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("categoryPlaceholder")} />
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
                    <FormLabel>{t("brandLabel")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("brandPlaceholder")} />
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

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> {t("saving")}
                  </>
                ) : (
                  t("saveButton")
                )}
              </Button>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;