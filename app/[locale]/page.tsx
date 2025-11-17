import { getTranslations } from "next-intl/server";
import AddProductForm from "@/components/AddProductForm";
import { getCategoryListActions } from "@/actions/category.action";
import { auth, clerkClient } from "@clerk/nextjs/server";
import AddBrandForm from "@/components/AddBrandForm";
import SimpleBottomNavigation from "@/components/ButtomBar";
import { FaStar } from "react-icons/fa";
import ProductGrid from "@/components/ProductGrid";
import { getBrandListActions, getBrandsByOwnerIdActions } from "@/actions/brand.action";
import AddCategoryForm from "@/components/AddCategoryForm";
import BrandGrid from "@/components/BrandGrid";
import CarouselComponent from "@/components/carocelComponent";
import { getProductListActions } from "@/actions/product.action";
import { getUserRole } from "@/lib/useUserRole";
import AddPremiumAccount from "@/components/ToPremiumAccount";
import { getActiveHeroSlidesAction } from "@/actions/hero.action";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const categories = await getCategoryListActions();

  const { userId, role } = await getUserRole();

  const brands = await getBrandListActions();
  const ownerBrands = await getBrandsByOwnerIdActions(userId);

  const initialProducts = await getProductListActions("", 0, 10);

  const loadMoreProducts = async (skip: number, take: number) => {
    "use server";
    return await getProductListActions("", skip, take);
  };
  const heroSlides = await getActiveHeroSlidesAction();
  //   {
  //     title: "خصم الصيف الكبير",
  //     subtitle: "خصم يصل إلى 50% على المجموعة الصيفية",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=404&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     buttonText: "تسوق الآن",
  //     href: "/summer-collection",
  //     isActive: true,
  //     order: 1,
  //   },
  //   {
  //     title: "مجموعة جديدة",
  //     subtitle: "اكتشف أحدث منتجاتنا لهذا الموسم",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     buttonText: "استكشف",
  //     href: "/new-arrivals",
  //     isActive: true,
  //     order: 2,
  //   },
  //   {
  //     title: "عروض خاصة",
  //     subtitle: "صفقات حصرية لمدة محدودة",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1593487568720-92097fb460fb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     buttonText: "استفد الآن",
  //     href: "/special-offers",
  //     isActive: true,
  //     order: 3,
  //   },
  // ];
  return (
    <div>
      <div className="pb-10">
        {heroSlides && heroSlides.length > 0 && (
          <div className="sm:p-14 p-7">
            <CarouselComponent slides={heroSlides} />
          </div>
        )}
        <div className="flex items-center justify-center mb-6 space-x-2 text-primary font-semibold">
          <FaStar />
          <span>{t("featuredProducts")}</span>
          <FaStar />
        </div>

        {initialProducts.length > 0 ? (
          <ProductGrid
            initialProducts={initialProducts}
            loadMoreAction={loadMoreProducts}
            hasMore={initialProducts.length === 10}
            userId={userId}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("noProductsAvailable")}</p>
          </div>
        )}

        <BrandGrid brands={brands} />

        {userId && role === "CLIENT" && <AddPremiumAccount userId={userId} />}
        {role === "ADMIN" && (
          <div>
            {" "}
            <AddCategoryForm />
          </div>
        )}
      </div>
    </div>
  );
}
