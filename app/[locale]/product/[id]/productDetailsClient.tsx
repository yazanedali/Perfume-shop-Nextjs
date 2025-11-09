"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, User as UserIcon, Phone, Mail, Store, MapPin, Clock, Shield, Truck } from "lucide-react"; 
import { useLocale } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { addToCart } from "@/actions/cart.action";

type SellerInfo = {
  id: string;
  name: string;
  email: string;
  phone?: number | null;
  createdAt?: Date;
  role?: string;
  companyName: string;
  logoUrl?: string | null;
  address?: string | null;
  description?: string | null;
};

type BrandWithSeller = {
  id: string;
  name: string;
  logoUrl?: string | null;
  owner: SellerInfo | null; // جعل owner يمكن أن يكون null
  ownerId?: string;
  brandOwners?: any[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  brand: BrandWithSeller;
  category: { 
    id: string;
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

type Translations = {
  addToCart: string;
  quantity: string;
  description: string;
  brand: string;
  category: string;
  sellerName: string;
  contactSeller: string;
  productDetails: string;
  availability: string;
  inStock: string;
  outOfStock: string;
  deliveryInfo: string;
  freeShipping: string;
  warranty: string;
  yearsWarranty: string;
  returnPolicy: string;
  daysReturn: string;
  contactInfo: string;
  email: string;
  phone: string;
  storeInfo: string;
  since: string;
  storeDescription: string;
  address: string;
  aboutStore: string;
};

export default function ProductDetailsClient({
  product,
  t,
  userId,
}: {
  product: Product;
  t: Translations;
  userId: string | null;
}) {
  const [quantity, setQuantity] = useState(1);
  const locale = useLocale();
  const [alert, setAlert] = useState<null | "login" | "added">(null);

  const handleAddToCart = async () => {
    if (!userId) {
      setAlert("login");
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    try {
      await addToCart(userId, product.id, quantity);
      setAlert("added");
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const seller = product.brand.owner;

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* قسم الصورة */}
      <div className="relative aspect-square w-full max-w-md">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* قسم التفاصيل */}
      <div className="flex flex-col space-y-6">
        {/* العلامة التجارية */}
        <Badge variant="secondary" className="w-fit">
          {product.brand.name}
        </Badge>

        {/* اسم المنتج */}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {product.name}
        </h1>

        {/* السعر */}
        <p className="text-2xl font-semibold text-primary">
          {formattedPrice}
        </p>

        {/* حالة التوفر */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">
            {product.quantity > 0 ? t.inStock : t.outOfStock}
          </span>
          {product.quantity > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              ({product.quantity} {t.availability})
            </span>
          )}
        </div>

        {/* وصف المنتج */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Store className="w-5 h-5" />
            {t.productDetails}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* معلومات إضافية عن المنتج */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* الفئة */}
          <div className="bg-muted/10 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">{t.category}</h3>
            <p className="font-medium">{product.category.name}</p>
          </div>

          {/* تاريخ الإضافة */}
          {product.createdAt && (
            <div className="bg-muted/10 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {t.since}
              </h3>
              <p className="font-medium text-sm">{formatDate(product.createdAt)}</p>
            </div>
          )}

          {/* الضمان */}
          <div className="bg-muted/10 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {t.warranty}
            </h3>
            <p className="font-medium">{t.yearsWarranty}</p>
          </div>

          {/* الشحن */}
          <div className="bg-muted/10 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Truck className="w-4 h-4" />
              {t.deliveryInfo}
            </h3>
            <p className="font-medium">{t.freeShipping}</p>
          </div>
        </div>

        {/* معلومات المتجر - عرض فقط إذا كان هناك بائع */}
        {seller && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <h3 className="text-lg font-bold text-accent-foreground mb-4 flex items-center gap-2">
              <Store className="w-5 h-5" />
              {t.storeInfo}
            </h3>
            
            {/* شعار الشركة */}
            {seller.logoUrl && (
              <div className="mb-4">
                <Image
                  src={seller.logoUrl}
                  alt={seller.companyName}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain"
                />
              </div>
            )}
            
            <div className="space-y-3">
              {/* اسم الشركة */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t.sellerName}</h4>
                <p className="font-medium">{seller.companyName}</p>
              </div>

              {/* وصف المتجر */}
              {seller.description && (
                <div className="bg-muted/10 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t.aboutStore}</h4>
                  <p className="text-sm text-muted-foreground">{seller.description}</p>
                </div>
              )}

              {/* العنوان */}
              {seller.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{seller.address}</span>
                </div>
              )}

              {/* معلومات التواصل */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{t.contactInfo}</h4>
                <div className="space-y-2">
                  {seller.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{seller.email}</span>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{seller.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* تاريخ انضمام البائع */}
              {seller.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{t.since} {formatDate(seller.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* أزرار التحكم بالكمية والإضافة للسلة */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-4">
          {/* التحكم بالكمية */}
          <div className="flex items-center border rounded-lg overflow-hidden bg-background">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-12 w-12"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => q + 1)}
              className="h-12 w-12"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* زر الإضافة للسلة */}
          <Button
            size="lg"
            className="flex-1 h-12"
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.quantity === 0 ? t.outOfStock : t.addToCart}
          </Button>
        </div>

        {/* التنبيهات */}
        {alert && (
          <Alert variant={alert === "added" ? "default" : "destructive"} className="mt-4">
            <AlertTitle>
              {alert === "added" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>
              {alert === "added" 
                ? "Product added to cart successfully!" 
                : "Please login to add items to cart"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}