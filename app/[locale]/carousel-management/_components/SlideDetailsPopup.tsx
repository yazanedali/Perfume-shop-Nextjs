"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { X, ExternalLink, CheckCircle, XCircle, Calendar } from "lucide-react";
import Image from "next/image";
import { HeroSlide } from "@prisma/client";

import { Button } from "@/components/ui/button";

interface SlideDetailsPopupProps {
  slide: HeroSlide | null;
  isOpen: boolean;
  onClose: () => void;
  onEditInfo: (slide: HeroSlide) => void;
  onEditImage: (slide: HeroSlide) => void;
  onDelete: (slide: HeroSlide) => void;
}

export const SlideDetailsPopup: React.FC<SlideDetailsPopupProps> = ({
  slide,
  isOpen,
  onClose,
  onEditInfo,
  onEditImage,
  onDelete
}) => {
  const t = useTranslations("CarouselManagement");

  if (!isOpen || !slide) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {t("slide_details")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("slide_details_description")}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* الصورة */}
          <div className="text-center">
            <div className="relative inline-block">
              <Image 
                src={slide.imageUrl} 
                alt={slide.title} 
                width={400} 
                height={200} 
                className="rounded-lg object-cover border shadow-sm"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {t("main_image")}
              </div>
            </div>
          </div>

          {/* الشبكة للمعلومات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={18} />
                  {t("basic_info")}
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-blue-700">{t("form_title")}</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{slide.title}</p>
                  </div>

                  {slide.subtitle && (
                    <div>
                      <label className="text-sm font-medium text-blue-700">{t("form_subtitle")}</label>
                      <p className="text-gray-700 mt-1">{slide.subtitle}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-blue-700">{t("form_order")}</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {slide.order}
                      </span>
                      <span className="text-sm text-gray-500">{t("order_hint")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المعلومات الإضافية */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  {t("additional_info")}
                </h4>
                
                <div className="space-y-3">
                  {/* الحالة */}
                  <div>
                    <label className="text-sm font-medium text-green-700">{t("form_is_active")}</label>
                    <div className="flex items-center gap-2 mt-1">
                      {slide.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          <CheckCircle size={14} />
                          {t("status_active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          <XCircle size={14} />
                          {t("status_inactive")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* زر الإجراء */}
                  {slide.buttonText && (
                    <div>
                      <label className="text-sm font-medium text-green-700">{t("form_button_text")}</label>
                      <p className="text-gray-700 mt-1">{slide.buttonText}</p>
                    </div>
                  )}

                  {/* الرابط */}
                  {slide.href && (
                    <div>
                      <label className="text-sm font-medium text-green-700">{t("form_href")}</label>
                      <a 
                        href={slide.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 break-all mt-1 text-sm"
                      >
                        {slide.href}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button 
            onClick={() => onEditInfo(slide)}
            variant="outline"
            className="flex-1 h-12 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            {t("edit_info")}
          </Button>
          <Button 
            onClick={() => onEditImage(slide)}
            variant="outline"
            className="flex-1 h-12 border-green-200 text-green-700 hover:bg-green-50"
          >
            {t("edit_image")}
          </Button>
          <Button 
            onClick={() => onDelete(slide)}
            variant="outline"
            className="flex-1 h-12 border-red-200 text-red-700 hover:bg-red-50"
          >
            {t("delete")}
          </Button>
        </div>
      </div>
    </div>
  );
};