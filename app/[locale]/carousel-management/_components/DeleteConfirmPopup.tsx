"use client";
import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading = false
}) => {
  const t = useTranslations("CarouselManagement");
  const popupRef = useRef<HTMLDivElement>(null);

  // إغلاق الـ popup عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        ref={popupRef}
        className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-full">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground">
              {t("confirm_delete")}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("delete_warning")}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">
              "{title}"
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {t("delete_irreversible")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
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
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {t("deleting")}
              </div>
            ) : (
              t("confirm_delete")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};