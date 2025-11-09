import { getTranslations } from "next-intl/server";
import { getProductByIdAction } from "@/actions/product.action";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailsClient from "./productDetailsClient";
import { getUserRole } from "@/lib/useUserRole";

type Props = {
  params: { id: string; locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: productId, locale } = await params;
  const product = await getProductByIdAction(productId);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: `${product.name} | ${t("storeName")}`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id: productId, locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProductPage" });
  const product = await getProductByIdAction(productId);
  const { userId, role } = await getUserRole(); 

  if (!product) {
    notFound();
  }

  const translations = {
    addToCart: t("addToCart"),
    quantity: t("quantity"),
    description: t("description"),
    brand: t("brand"),
    category: t("category"),
    sellerName: t("sellerName"),
    contactSeller: t("contactSeller"),
    productDetails: t("productDetails"),
    availability: t("availability"),
    inStock: t("inStock"),
    outOfStock: t("outOfStock"),
    deliveryInfo: t("deliveryInfo"),
    freeShipping: t("freeShipping"),
    warranty: t("warranty"),
    yearsWarranty: t("yearsWarranty"),
    returnPolicy: t("returnPolicy"),
    daysReturn: t("daysReturn"),
    contactInfo: t("contactInfo"),
    email: t("email"),
    phone: t("phone"),
    storeInfo: t("storeInfo"),
    since: t("since"),
    storeDescription: t("storeDescription"),
    address: t("address"),
    aboutStore: t("aboutStore"),
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <ProductDetailsClient product={product} t={translations} userId={userId} />
    </div>
  );
}