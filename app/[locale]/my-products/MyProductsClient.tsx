"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";
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
import { ProductCard } from "./ProductCard";
// استيراد المكونات الجديدة
import AddProductForm from "@/components/AddProductForm";
import AddBrandForm from "@/components/AddBrandForm";

// تعريف الواجهات المستخدمة
import { ICategory, OwnerBrand } from "@/interfaces";
import { EditProductDataForm } from "@/components/EditProductDataForm";
import { EditProductImageForm } from "@/components/EditProductImageForm";
import { UpdateQuantityForm } from "@/components/UpdateQuantityForm";

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
  userId,
}: {
  products: Product[];
  locale: string;
  categories: ICategory[];
  brands: OwnerBrand[];
  userId: string;
}) {
  const t = useTranslations("MyProductsPage");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // حالات الديالوجات المختلفة
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDataDialogOpen, setIsEditDataDialogOpen] = useState(false);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [isEditImageDialogOpen, setIsEditImageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const handleQuantityClick = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setIsQuantityDialogOpen(true);
  };

  const handleQuantityUpdated = (productId: string, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };



  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleEditDataClick = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setIsEditDataDialogOpen(true);
  };

  const handleEditImageClick = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProduct(product);
    setIsEditImageDialogOpen(true);
  };

  const handleProductUpdated = () => {
    window.location.reload();
  };

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

  // أيقونات للأزرار
   const QuantityIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" transform="rotate(90 12 12)"/>
    </svg>
  );

  const EditIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const ImageIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  const ViewIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  return (
    <>
      <div className="container mx-auto p-6 bg-background text-foreground min-h-screen w-full">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          {t("myProductsTitle")}
        </h1>

        {/* قسم الأزرار الجديد مع الترجمات */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* زر إضافة منتج جديد */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("addNewProduct")}
                </h2>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                {t("addNewProductDescription")}
              </p>
              <AddProductForm
                categories={categories}
                userId={userId}
                brands={brands}
              />
            </div>

            {/* زر إضافة علامة تجارية */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("addNewBrand")}
                </h2>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                {t("addNewBrandDescription")}
              </p>
              <AddBrandForm userId={userId} />
            </div>
          </div>
        </div>

        {/* قسم المنتجات مع الترجمة */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">
              {t("myProductsCount", { count: products.length })}
            </h2>
          </div>
          <div className="p-6">
            {products.length === 0 ? (
              <p className="text-center text-muted-foreground text-lg py-8">
                {t("noProducts")}
              </p>
            ) : !isClient ? null : isMobile ? (
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
                    onQuantityClick={(e) => handleQuantityClick(product)}

                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-primary/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("image")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("name")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("brand")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("category")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("price")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {t("quantity")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 relative overflow-hidden rounded-md border border-border">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-foreground font-medium max-w-[200px] truncate">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {product.brand.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                          {product.category.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-foreground">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-foreground">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.quantity > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : product.quantity > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div
                            className="flex gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleEditDataClick(product, e)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                              title={t("editData")}
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleEditImageClick(product, e)}
                              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                              title={t("editImage")}
                            >
                              <ImageIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteClick(product, e)}
                              disabled={isDeleting}
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                              title={t("delete")}
                            >
                              <DeleteIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleProductClick(product)}
                              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                              title={t("viewDetails")}
                            >
                              <ViewIcon />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleQuantityClick(product, e)}
                              className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900"
                              title={t("updateQuantity")}
                            >
                              <QuantityIcon />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog لعرض تفاصيل المنتج مع الترجمات */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-primary">
                  {t("productDetails")} - {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t("productDetailsDescription", {
                    productName: selectedProduct.name,
                  })}
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
                      {t("productInformation")}
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
                <Button
                  variant="default"
                  onClick={() => {
                    handleCloseDetailDialog();
                    handleEditDataClick(selectedProduct);
                  }}
                >
                  {t("editData")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleCloseDetailDialog();
                    handleEditImageClick(selectedProduct);
                  }}
                >
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

       {/* Dialog تعديل كمية المنتج */}
      {selectedProduct && (
        <UpdateQuantityForm
          isOpen={isQuantityDialogOpen}
          onOpenChange={setIsQuantityDialogOpen}
          product={selectedProduct}
          onQuantityUpdated={handleQuantityUpdated}
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
                ? `${t("confirmDeleteMessage")}${productToDelete.name}?`
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
