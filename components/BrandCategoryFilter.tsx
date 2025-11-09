"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";


interface ICategory {
    id: string;
    name: string;
}

interface Props {
  categories: ICategory[];
  allCategoriesLabel: string;
}

export default function BrandCategoryFilter({
  categories,
  allCategoriesLabel,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleFilter = (categoryId: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!categoryId) {
      current.delete("category");
    } else {
      current.set("category", categoryId);
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
          !currentCategory ? activeClasses : inactiveClasses
        )}
      >
        {allCategoriesLabel}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleFilter(category.id)}
          className={cn(
            baseButtonClasses,
            currentCategory === category.id ? activeClasses : inactiveClasses
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}