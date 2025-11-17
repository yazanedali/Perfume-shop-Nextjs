'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  onProductClick: (product: Product) => void;
  onEditDataClick: (product: Product, e: React.MouseEvent) => void;
  onEditImageClick: (product: Product, e: React.MouseEvent) => void;
  onDeleteClick: (product: Product, e: React.MouseEvent) => void;
  isDeleting: boolean; // لحالة زر الحذف
  onQuantityClick: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard = ({
  product,
  locale,
  onProductClick,
  onEditDataClick,
  onEditImageClick,
  onDeleteClick,
  isDeleting,
  onQuantityClick,
}: ProductCardProps) => {
  const t = useTranslations("MyProductsPage");

  return (
    <div
      key={product.id}
      className="perfume-card flex flex-col md:flex-row items-center cursor-pointer gap-4 p-4 hover:bg-accent/10 transition-colors"
      onClick={() => onProductClick(product)}
    >
      {/* Product Image */}
      <div className="w-24 h-24 relative overflow-hidden rounded-md border border-border shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 text-center md:text-left space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{product.brand.name}</Badge>
          <Badge variant="outline">{product.category.name}</Badge>
          <p>{t("price")}: <span className="font-bold text-primary">${product.price.toFixed(2)}</span></p>
          <p>{t("quantity")}: <span className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-destructive'}`}>{product.quantity}</span></p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 mt-4 md:mt-0" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => onEditDataClick(product, e)}
        >
          {t("editData")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => onEditImageClick(product, e)}
        >
          {t("editImage")}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => onDeleteClick(product, e)}
          disabled={isDeleting}
        >
          {t("delete")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => onQuantityClick(product, e)}
        >
          {t("updateQuantity")}
        </Button>
      </div>
    </div>
  );
};