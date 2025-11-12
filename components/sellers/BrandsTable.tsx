"use client";

import { useState } from "react";
import { updateProductLimit } from "@/actions/product.action";
import { BrandData, LimitPopupState, DetailPopupState } from "@/interfaces/index";
import SellersHeader from "./SellersHeader";
import SellersTable from "./SellersTable";
import SellersMobileView from "./SellersMobileView";
import LimitUpdatePopup from "./LimitUpdatePopup";
import SellerDetailsPopup from "./SellerDetailsPopup";

interface Props {
  sellers: BrandData[];
}

export default function BrandsTable({ sellers }: Props) {
  const [limits, setLimits] = useState(
    sellers.reduce((acc, seller) => {
      acc[seller.sellerEmail] = seller.productLimit;
      return acc;
    }, {} as Record<string, number>)
  );

  const [limitPopup, setLimitPopup] = useState<LimitPopupState>({ open: false });
  const [detailPopup, setDetailPopup] = useState<DetailPopupState>({ open: false });

  const handleLimitChange = (email: string, value: number) => {
    setLimits((prev) => ({ ...prev, [email]: value }));
  };

  const openLimitPopup = (seller: BrandData) => {
    setLimitPopup({
      open: true,
      sellerEmail: seller.sellerEmail,
      sellerName: seller.sellerName,
      oldValue: seller.productLimit,
      newValue: limits[seller.sellerEmail],
    });
  };

  const openDetailPopup = (seller: BrandData) => {
    setDetailPopup({
      open: true,
      seller: seller,
    });
  };

  const closeLimitPopup = () => setLimitPopup({ open: false });
  const closeDetailPopup = () => setDetailPopup({ open: false });

  const handleNewValueChange = (value: number) => {
    setLimitPopup(prev => ({ ...prev, newValue: value }));
  };

  const confirmUpdate = async () => {
    if (limitPopup.sellerEmail && limitPopup.newValue !== undefined) {
      await updateProductLimit(limitPopup.sellerEmail, limitPopup.newValue);
      setLimits((prev) => ({ ...prev, [limitPopup.sellerEmail!]: limitPopup.newValue! }));
    }
    closeLimitPopup();
  };

  const handleOpenLimitFromDetails = () => {
    closeDetailPopup();
    if (detailPopup.seller) {
      setTimeout(() => openLimitPopup(detailPopup.seller!), 100);
    }
  };

  return (
    <div className="w-full max-w-full p-4 bg-background min-h-screen">
      <SellersHeader />

      {/* Desktop and Mobile Views */}
      <SellersTable
        sellers={sellers}
        limits={limits}
        onLimitChange={handleLimitChange}
        onOpenDetailPopup={openDetailPopup}
        onOpenLimitPopup={openLimitPopup}
      />

      <SellersMobileView
        sellers={sellers}
        limits={limits}
        onLimitChange={handleLimitChange}
        onOpenDetailPopup={openDetailPopup}
        onOpenLimitPopup={openLimitPopup}
      />

      {/* Popups */}
      <LimitUpdatePopup
        popup={limitPopup}
        onClose={closeLimitPopup}
        onConfirm={confirmUpdate}
        onNewValueChange={handleNewValueChange}
      />

      {detailPopup.open && detailPopup.seller && (
        <SellerDetailsPopup
          seller={detailPopup.seller}
          onClose={closeDetailPopup}
          onOpenLimitPopup={handleOpenLimitFromDetails}
        />
      )}
    </div>
  );
}