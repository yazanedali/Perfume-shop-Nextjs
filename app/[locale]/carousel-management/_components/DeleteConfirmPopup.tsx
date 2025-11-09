"use client";
import React from "react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("confirm_delete")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("delete_warning")}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              "{title}"
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {t("delete_irreversible")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t">
          <Button 
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12"
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button 
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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