"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { heroSlideFormSchema } from "@/schema";
import { createHeroSlideAction } from "@/actions/hero.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import Spinner from "../../../../components/spinner";
import { Switch } from "@/components/ui/switch";

export const AddCarouselSlideForm = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("CarouselManagement");

  const form = useForm({
    resolver: zodResolver(heroSlideFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      buttonText: "",
      href: "",
      order: 1,
      isActive: true,
      imageUrl: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof heroSlideFormSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", values.imageUrl);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");
      const imageUrl = data.url;

      const result = await createHeroSlideAction({
        ...values,
        subtitle: values.subtitle ?? "",
        buttonText: values.buttonText ?? "",
        href: values.href ?? "",
        imageUrl: imageUrl,
      });

      if (result.success) {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ ما.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
          <PlusCircle size={20} />
          <span>{t("add_slide")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[500px] md:max-w-[600px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {t("create_slide")}
          </DialogTitle>
        </DialogHeader>
        {/* إخفاء شريط التمرير مع الاحتفاظ بإمكانية التمرير */}
        <div className="py-4 max-h-[85vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {/* Grid Container for better responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Title - Full width on mobile, half on larger screens */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          {t("form_title")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form_title")}
                            {...field}
                            className="text-sm sm:text-base h-10 sm:h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subtitle - Full width on mobile, half on larger screens */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          {t("form_subtitle")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form_subtitle")}
                            {...field}
                            className="text-sm sm:text-base h-10 sm:h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Button Text */}
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("form_button_text")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form_button_text")}
                          {...field}
                          className="text-sm sm:text-base h-10 sm:h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Href */}
                <FormField
                  control={form.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("form_href")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/perfume"
                          {...field}
                          className="text-sm sm:text-base h-10 sm:h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Order */}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        {t("form_order")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          className="text-sm sm:text-base h-10 sm:h-12"
                          ref={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                          value={
                            field.value === undefined ? "" : String(field.value)
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? undefined : Number(value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload - Full width */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field: { onChange, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">
                          {t("form_image_url")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            className="text-sm sm:text-base h-10 sm:h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Switch - Full width with RTL support */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel
                            className="text-sm sm:text-base cursor-pointer"
                            htmlFor="isActive"
                          >
                            {t("form_is_active")}
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="isActive"
                              name="isActive"
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
              >
                {loading ? <Spinner /> : t("save_changes")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
