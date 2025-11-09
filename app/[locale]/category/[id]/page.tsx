import { getTranslations } from "next-intl/server";
import { getCategoryByIdAction } from "@/actions/category.action";
import { getProductsByCategoryActions } from "@/actions/product.action";
import { getBrandListActions } from "@/actions/brand.action";
import ProductGrid from "@/components/ProductGrid";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryBrandFilter from "@/components/CategoryBrandFilter";
import { getUserRole } from "@/lib/useUserRole";

type Props = {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: Omit<Props, "searchParams">): Promise<Metadata> {
  const { id: categoryId, locale } = await params;
  const category = await getCategoryByIdAction(categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The category you are looking for does not exist.",
    };
  }

  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: `${category.name} | ${t("storeName")}`,
    description: t("categoryDescription", { categoryName: category.name }),
    openGraph: {
      title: `${category.name} | ${t("storeName")}`,
      description: t("categoryDescription", { categoryName: category.name }),
    },
  };
}

export default async function CategoryPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const { id: categoryId, locale } = params;
  const selectedBrand =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  const [category, brands, initialProducts] = await Promise.all([
    getCategoryByIdAction(categoryId),
    getBrandListActions(),
    getProductsByCategoryActions(categoryId, "", 0, 10, selectedBrand),
  ]);

  if (!category) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "CategoryPage" });

  const { userId } = await getUserRole();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {category.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("browsePrompt", { categoryName: category.name })}
        </p>
      </div>

      <CategoryBrandFilter brands={brands} allBrandsLabel={t("allBrands")} />

      {initialProducts.length > 0 ? (
        <ProductGrid
          initialProducts={initialProducts}
          categoryId={categoryId}
          brandId={selectedBrand}
          userId={userId}
        />
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">{t("noProducts")}</p>
        </div>
      )}
    </div>
  );
}
