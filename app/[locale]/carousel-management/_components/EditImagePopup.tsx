"use client";
import React, { useState, useEffect } from "react";
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">{t("edit_image")}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                  className="rounded-lg object-cover border mx-auto"
                  onError={(e) => {
                    console.error("Failed to load image:", imagePreview);
                    e.currentTarget.src = "/images/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-64 h-32 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-gray-500">لا توجد صورة</span>
                </div>
              )}
              <div className="text-sm text-gray-500 mt-2">
                {t("image_preview")}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form_image_url")}
              </label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="h-12"
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("image_requirements")}
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12"
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || !selectedFile}
                className="flex-1 h-12 text-base font-medium"
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