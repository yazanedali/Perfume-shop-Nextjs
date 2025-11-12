"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { heroSlideFormSchema } from "@/schema";
import { updateHeroSlideInfoAction } from "@/actions/hero.action";
import { HeroSlide } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";
import { Switch } from "@/components/ui/switch";

interface EditInfoPopupProps {
  slide: HeroSlide | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditInfoPopup: React.FC<EditInfoPopupProps> = ({
  slide,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("CarouselManagement");
  const popupRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(heroSlideFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      buttonText: "",
      href: "",
      order: 1,
      isActive: true,
    },
    mode: "onChange",
  });

  // إغلاق الـ popup عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen && slide) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, slide, onClose]);

  // تحديث الفورم عندما يتغير الـ slide
  useEffect(() => {
    if (slide && isOpen) {
      console.log("🔄 Setting form values for slide:", slide);
      form.reset({
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        buttonText: slide.buttonText || "",
        href: slide.href || "",
        order: slide.order || 1,
        isActive: slide.isActive ?? true,
      });
    }
  }, [slide, isOpen, form]);

  // إغلاق عند الضغط على ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const onSubmit = async (values: z.infer<typeof heroSlideFormSchema>) => {
    if (!slide) {
      console.error("❌ No slide selected");
      toast.error("لم يتم اختيار شريحة للتعديل");
      return;
    }
    
    console.log("🎯 Form submitted with values:", values);
    console.log("🎯 Slide ID:", slide.id);
    
    setLoading(true);
    try {
      console.log("🚀 Calling updateHeroSlideInfoAction...");
      
      const result = await updateHeroSlideInfoAction({
        id: slide.id,
        title: values.title,
        subtitle: values.subtitle || "",
        buttonText: values.buttonText || "",
        href: values.href || "",
        isActive: values.isActive,
        order: values.order,
      });

      console.log("📨 Action result:", result);

      if (result.success) {
        console.log("✅ Update successful");
        toast.success(result.message);
        onSuccess();
        onClose();
      } else {
        console.error("❌ Update failed:", result.message);
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("💥 Update error:", error);
      toast.error(error.message || "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !slide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        ref={popupRef}
        className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-card-foreground">
            {t("edit_info")}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField 
                control={form.control} 
                name="title" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">
                      {t("form_title")}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("form_title")} 
                        {...field}
                        className="h-12 bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                control={form.control} 
                name="subtitle" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">
                      {t("form_subtitle")}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("form_subtitle")} 
                        {...field}
                        className="h-12 bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="buttonText" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">
                      {t("form_button_text")}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("form_button_text")} 
                        {...field}
                        className="h-12 bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                control={form.control} 
                name="href" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">
                      {t("form_href")}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...field}
                        className="h-12 bg-background border-border text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <FormField 
                control={form.control} 
                name="order" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-card-foreground">
                      {t("form_order")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        className="h-12 bg-background border-border text-foreground"
                        value={field.value as number}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? 1 : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                control={form.control} 
                name="isActive" 
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer text-card-foreground">
                        {t("form_is_active")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </FormControl>
                  </FormItem>
                )} 
              />

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 border-border text-foreground hover:bg-muted"
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? <Spinner /> : t("update_info")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};