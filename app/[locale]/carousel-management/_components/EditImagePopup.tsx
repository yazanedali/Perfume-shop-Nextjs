"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import Image from "next/image";

import { updateHeroSlideImageAction } from "@/actions/hero.action";
import { HeroSlide } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";

interface EditImagePopupProps {
  slide: HeroSlide | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditImagePopup: React.FC<EditImagePopupProps> = ({
  slide,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const t = useTranslations("CarouselManagement");
  const popupRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (slide && isOpen) {
      setImagePreview(slide.imageUrl);
      setSelectedFile(null);
    }
  }, [slide, isOpen]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !slide) return;

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !slide) {
      toast.error("يرجى اختيار صورة أولاً");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await res.json();
      if (!res.ok) throw new Error(uploadData.error || "Failed to upload image");

      // تحديث الصورة في قاعدة البيانات
      const result = await updateHeroSlideImageAction({
        id: slide.id,
        imageUrl: uploadData.url,
      });

      if (result.success) {
        toast.success(result.message);
        onSuccess();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث الصورة.");
      console.error(error);
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
            {t("edit_image")}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* معاينة الصورة */}
          <div className="text-center">
            <div className="relative inline-block">
              {imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt={slide.title} 
                  width={300} 
                  height={150} 
                  className="rounded-lg object-cover border border-border mx-auto"
                  onError={(e) => {
                    console.error("Failed to load image:", imagePreview);
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-64 h-32 bg-muted rounded-lg flex items-center justify-center mx-auto border border-border">
                  <span className="text-muted-foreground">لا توجد صورة</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                {t("image_preview")}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                {t("form_image_url")}
              </label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="h-12 bg-background border-border text-foreground"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {t("image_requirements")}
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 border-border text-foreground hover:bg-muted"
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || !selectedFile}
                className="flex-1 h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? <Spinner /> : t("update_image")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};