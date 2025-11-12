"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Store, MapPin, Mail, Phone, Clock, Users, Package } from "lucide-react";
import { BrandData, RequestStatus } from "@/interfaces/index";

interface SellerDetailsPopupProps {
  seller: BrandData;
  onClose: () => void;
  onOpenLimitPopup: () => void;
}

export default function SellerDetailsPopup({
  seller,
  onClose,
  onOpenLimitPopup,
}: SellerDetailsPopupProps) {
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
    if (seller) {
      document.addEventListener("mousedown", handleClickOutside);
      // منع التمرير في الخلفية
      document.body.style.overflow = "hidden";
    }

    // تنظيف المستمع عند إغلاق الـ popup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [seller, onClose]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhone = (phone?: string | null) => {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const translateStatus = (status: RequestStatus) => {
    return t(`statusTypes.${status}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Store className="w-6 h-6" />
              {t("sellerDetails")}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              {seller.ownerLogo ? (
                <div className="w-20 h-20 relative rounded-xl overflow-hidden border border-border">
                  <Image
                    src={seller.ownerLogo}
                    alt={`${seller.sellerName} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-xl border border-border">
                  <Store className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-foreground">{seller.companyName}</h4>
                <p className="text-muted-foreground">{seller.sellerEmail}</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{seller.brandCount} {t("stats.brands")}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{seller.productCount} {t("stats.products")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{seller.brandCount}</div>
                <div className="text-sm text-muted-foreground">{t("totalBrands")}</div>
              </div>
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{seller.productCount}</div>
                <div className="text-sm text-muted-foreground">{t("activeProducts")}</div>
              </div>
            </div>

            {/* Product Limit Section */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3">
                {t("productLimit")}
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">{t("currentLimit")}: </span>
                  <span className="font-semibold text-foreground">{seller.productLimit}</span>
                </div>
                <button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  onClick={onOpenLimitPopup}
                >
                  {t("updateLimit")}
                </button>
              </div>
            </div>

            {/* Store Information */}
            <div className="bg-muted/10 border border-border rounded-lg p-4">
              <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Store className="w-5 h-5" />
                {t("storeInformation")}
              </h4>
              
              <div className="space-y-4">
                {/* Seller Name */}
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground">
                    {t("sellerName")}
                  </h5>
                  <p className="font-medium text-foreground">{seller.sellerName}</p>
                </div>

                {/* Company Name */}
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground">
                    {t("companyName")}
                  </h5>
                  <p className="font-medium text-foreground">{seller.companyName}</p>
                </div>

                {/* Description */}
                {seller.description && (
                  <div className="bg-muted/5 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-muted-foreground mb-1">
                      {t("aboutStore")}
                    </h5>
                    <p className="text-sm text-muted-foreground">{seller.description}</p>
                  </div>
                )}

                {/* Address */}
                {seller.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.address}</span>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{seller.sellerEmail}</span>
                  </div>
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatPhone(seller.phone)}</span>
                    </div>
                  )}
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{t("memberSince")} {formatDate(seller.createdAt)}</span>
                </div>

                {/* Request Status */}
                {seller.requestStatus && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("status")}:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      seller.requestStatus === 'APPROVED' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : seller.requestStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {translateStatus(seller.requestStatus)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}