"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface IBrand {
  id: string;
  name: string;
}

interface Props {
  brands: IBrand[];
  allBrandsLabel: string;
}

export default function CategoryBrandFilter({
  brands,
  allBrandsLabel,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand");

  const handleFilter = (brandId: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!brandId) {
      current.delete("brand");
    } else {
      current.set("brand", brandId);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  const baseButtonClasses =
    "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  const inactiveClasses = "bg-muted text-muted-foreground hover:bg-accent";
  const activeClasses = "bg-primary text-primary-foreground shadow-md";

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 flex-wrap mb-8 sm:mb-12">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          baseButtonClasses,
          !currentBrand ? activeClasses : inactiveClasses
        )}
      >
        {allBrandsLabel}
      </button>
      {brands.map((brand) => (
        <button
          key={brand.id}
          onClick={() => handleFilter(brand.id)}
          className={cn(
            baseButtonClasses,
            currentBrand === brand.id ? activeClasses : inactiveClasses
          )}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}