// app/[locale]/my-products/MyProductsClient.tsx
"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // استيراد React هنا
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/product.action";

// استيراد مكونات نماذج التعديل الجديدة
import { ProductCard } from "./ProductCard"; // 👈 استيراد مكون البطاقة الجديد

// تعريف الواجهات المستخدمة
import { ICategory, OwnerBrand } from "@/interfaces";
import { EditProductDataForm } from "@/components/EditProductDataForm";
import { EditProductImageForm } from "@/components/EditProductImageForm";

// تعريف نوع المنتج
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

export default function MyProductsClient({
  products: initialProducts,
  locale,
  categories,
  brands,
}: {
  products: Product[];
  locale: string;
  categories: ICategory[];
  brands: OwnerBrand[];
}) {
  const t = useTranslations("MyProductsPage");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // حالات الديالوجات المختلفة
   const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDataDialogOpen, setIsEditDataDialogOpen] = useState(false);
  const [isEditImageDialogOpen, setIsEditImageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // القيمة الافتراضية false
  const [isClient, setIsClient] = useState(false); // حالة جديدة للتحقق من أننا على العميل

  // 👈 useEffect للكشف عن حجم الشاشة
  useEffect(() => {
    setIsClient(true); // تأكيد أننا على العميل
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // تحقق عند التحميل الأولي على العميل
    checkMobile();

    // أضف مستمعًا لحدث تغيير حجم النافذة
    window.addEventListener('resize', checkMobile);

    // تنظيف المستمع عند إزالة المكون
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // فتح ديالوج تفاصيل المنتج (عند النقر على صف الجدول أو البطاقة)
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  // إغلاق ديالوج تفاصيل المنتج
  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  // فتح ديالوج تعديل البيانات
  const handleEditDataClick = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setIsEditDataDialogOpen(true);
  };

  // فتح ديالوج تعديل الصورة
  const handleEditImageClick = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setIsEditImageDialogOpen(true);
  };

  // يتم استدعاء هذه الدالة بعد تحديث أي جزء من المنتج
  const handleProductUpdated = () => {
    window.location.reload();
  };

  // دوال الحذف
  const handleDeleteClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(productToDelete.id);

      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        toast.success(t("deleteSuccess"));
      } else {
        toast.error(result.error || t("deleteError"));
      }
    } catch (error) {
      toast.error(t("deleteError"));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };


   return (
    <>
      <div className="container mx-auto p-6 bg-background text-foreground min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          {t("myProductsTitle")}
        </h1>

         {products.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            {t("noProducts")}
          </p>
        ) : (
         // تأجيل العرض الشرطي حتى يتم التحميل على العميل
          !isClient ? null : isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  onProductClick={handleProductClick}
                  onEditDataClick={handleEditDataClick}
                  onEditImageClick={handleEditImageClick}
                  onDeleteClick={handleDeleteClick}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg border border-border">
              <table className="min-w-full divide-y divide-border bg-card">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("image")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("brand")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("category")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("price")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("quantity")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-accent/10 transition-colors cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 relative overflow-hidden rounded-md border border-border">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {product.brand.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => handleEditDataClick(product, e)}
                          >
                            {t("editData")}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => handleEditImageClick(product, e)}
                          >
                            {t("editImage")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleDeleteClick(product, e)}
                            disabled={isDeleting}
                          >
                            {t("delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Dialog لعرض تفاصيل المنتج */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t("productDetailsDescription", { productName: selectedProduct.name })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t("description")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("brand")}
                      </h4>
                      <Badge variant="secondary" className="text-sm">
                        {selectedProduct.brand.name}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("category")}
                      </h4>
                      <Badge variant="outline" className="text-sm">
                        {selectedProduct.category.name}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("price")}
                      </h4>
                      <p className="text-2xl font-bold text-primary">
                        ${selectedProduct.price.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("quantity")}
                      </h4>
                      <p
                        className={`text-lg font-semibold ${
                          selectedProduct.quantity > 0
                            ? "text-green-600"
                            : "text-destructive"
                        }`}
                      >
                        {selectedProduct.quantity} {t("inStock")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("createdAt")}
                      </h4>
                      <p className="text-sm text-foreground">
                        {selectedProduct.createdAt.toLocaleDateString(locale)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {t("updatedAt")}
                      </h4>
                      <p className="text-sm text-foreground">
                        {selectedProduct.updatedAt.toLocaleDateString(locale)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button variant="outline" onClick={handleCloseDetailDialog}>
                  {t("close")}
                </Button>
                <Button variant="default" onClick={() => {
                  handleCloseDetailDialog();
                  handleEditDataClick(selectedProduct);
                }}>
                  {t("editData")}
                </Button>
                <Button variant="secondary" onClick={() => {
                  handleCloseDetailDialog();
                  handleEditImageClick(selectedProduct);
                }}>
                  {t("editImage")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog تعديل بيانات المنتج */}
      {selectedProduct && isEditDataDialogOpen && (
        <EditProductDataForm
          isOpen={isEditDataDialogOpen}
          onOpenChange={setIsEditDataDialogOpen}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            quantity: selectedProduct.quantity,
            categoryId: selectedProduct.category.id,
            brandId: selectedProduct.brand.id,
          }}
          categories={categories}
          brands={brands}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Dialog تعديل صورة المنتج */}
      {selectedProduct && isEditImageDialogOpen && (
        <EditProductImageForm
          isOpen={isEditImageDialogOpen}
          onOpenChange={setIsEditImageDialogOpen}
          productId={selectedProduct.id}
          currentImageUrl={selectedProduct.imageUrl}
          onImageUpdated={handleProductUpdated}
        />
      )}

      {/* Dialog تأكيد الحذف */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete?.name
                ? t("confirmDeleteMessage", {
                    productName: productToDelete.name,
                  })
                : t("confirmDeleteMessageDefault")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("deleting") : t("confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}