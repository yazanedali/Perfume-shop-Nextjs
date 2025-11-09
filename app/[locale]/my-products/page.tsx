// app/[locale]/my-products/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/useUserRole"; // جلب معرف المستخدم ودوره
import { getSellerProducts } from "@/actions/product.action";
import { getCategoryListActions } from "@/actions/category.action"; // استيراد جلب الفئات
import { getBrandsByOwnerIdActions } from "@/actions/brand.action"; // استيراد جلب العلامات التجارية للبائع

import MyProductsClient from "./MyProductsClient";

export default async function MyProductsPage({ params }: { params: { locale: string } }) {
  // لا حاجة لـ await params؛ params هو كائن مباشر
  const { locale } = await params;
  const { userId, role } = await getUserRole(); // جلب معرف المستخدم ودوره

  // التحقق من تسجيل الدخول ودور البائع
  if (!userId || role !== "SELLER") {
    redirect("/sign-in"); // توجيه المستخدم إذا لم يكن مسجلاً الدخول أو ليس بائعًا
  }

  // جلب المنتجات الخاصة بالبائع
  const products = await getSellerProducts(userId);

  // جلب الفئات والعلامات التجارية لنموذج التعديل
  const categories = await getCategoryListActions();
  // جلب العلامات التجارية التي يمتلكها هذا البائع فقط، ليتوافق مع منطق AddProductForm
  const brands = await getBrandsByOwnerIdActions(userId);

  return (
    <MyProductsClient
      products={products}
      locale={locale}
      categories={categories} // تمرير الفئات إلى المكون العميل
      brands={brands}     // تمرير العلامات التجارية إلى المكون العميل
    />
  );
}