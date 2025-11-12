"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { LimitPopupState } from "@/interfaces/index";

interface LimitUpdatePopupProps {
  popup: LimitPopupState;
  onClose: () => void;
  onConfirm: () => void;
  onNewValueChange: (value: number) => void;
}

export default function LimitUpdatePopup({
  popup,
  onClose,
  onConfirm,
  onNewValueChange,
}: LimitUpdatePopupProps) {
  const t = useTranslations("SellersManagement");
  const popupRef = useRef<HTMLDivElement>(null);

  // دالة لإغلاق الـ popup عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // إضافة المستمع عند فتح الـ popup
    if (popup.open) {
      document.addEventListener("mousedown", handleClickOutside);
      // منع التمرير في الخلفية
      document.body.style.overflow = "hidden";
    }

    // تنظيف المستمع عند إغلاق الـ popup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [popup.open, onClose]);

  if (!popup.open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t("updateLimit")}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t("updateLimitFor")} <strong className="text-foreground">{popup.sellerName}</strong>
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">
                {t("currentLimit")}:
              </span>
              <span className="font-semibold text-foreground">{popup.oldValue}</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t("newLimit")}:
              </label>
              <input
                type="number"
                value={popup.newValue}
                onChange={(e) => onNewValueChange(Math.max(0, Number(e.target.value)))}
                className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              onClick={onConfirm}
            >
              {t("confirmUpdate")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}