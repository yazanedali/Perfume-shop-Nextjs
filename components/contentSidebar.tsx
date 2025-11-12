// components/ui/ContentSidebar.tsx
"use client";
import React, { useState } from "react";

import { ICategory } from "@/interfaces";
import { useTranslations } from "next-intl";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  Star,
  Heart,
  Gem,
  ChevronDown,
  ChevronUp,
  Tags,
  ClipboardPlus,
  Bookmark,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { LinkWithSpinner } from "./ui/LinkWithSpinner";

interface Brand {
  name: string;
  id: string;
  logoUrl?: string | null;
}

const ContentSidebar = ({
  categories,
  brands,
  role,
}: {
  categories: ICategory[];
  brands: Brand[];
  role?: string;
}) => {
  const t = useTranslations("Sidebar");

  const [openCategories, setOpenCategories] = useState(true);
  const [openBrands, setOpenBrands] = useState(true);

  const mainItems = [
    { title: t("home"), url: "/", icon: Home },
    { title: t("cart"), url: "/cart", icon: ShoppingCart },
  ];

  return (
    <div className="w-full h-full bg-card text-foreground flex flex-col">
      <div className="p-5 border-b border-border">
        <LinkWithSpinner href="/" className="flex items-center gap-4 group">
          <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
            <Gem size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary tracking-wide">
              {t("storeName")}
            </h1>
            <p className="text-xs text-muted-foreground">{t("tagline")}</p>
          </div>
        </LinkWithSpinner>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scroll-hide">
        <div className="space-y-1 py-2">
          {mainItems.map((item) => (
            <LinkWithSpinner
              key={item.title}
              href={item.url}
              className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
            >
              <item.icon
                size={20}
                className="text-muted-foreground group-hover:text-inherit transition-colors"
              />
              <span className="font-medium text-inherit">{item.title}</span>
            </LinkWithSpinner>
          ))}

          {role === "ADMIN" && (
            <>
              <LinkWithSpinner
                href="/carousel-management"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <LayoutDashboard
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">
                  {t("manage_carousel")}
                </span>
              </LinkWithSpinner>
              <LinkWithSpinner
                href="/brands"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <Tags
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">
                  {t("all_salers")}
                </span>
              </LinkWithSpinner>

              <LinkWithSpinner
                href="/requests"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <ClipboardPlus
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">
                  {t("register_brand")}
                </span>
              </LinkWithSpinner>

              <LinkWithSpinner
                href="/orders-management"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <ClipboardPlus
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">
                  {t("manage_orders")}
                </span>
              </LinkWithSpinner>
            </>
          )}
          {role === "SELLER" && (
            <>
              {/* 👈 رابط جديد لمنتجات البائع */}
              <LinkWithSpinner
                href="/my-products"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <Package
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">
                  {t("myProducts")}
                </span>
              </LinkWithSpinner>

              <LinkWithSpinner
                href="/sales"
                className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
              >
                <ClipboardPlus
                  size={20}
                  className="text-muted-foreground group-hover:text-inherit transition-colors"
                />
                <span className="font-medium text-inherit">{t("my_sales")}</span>
              </LinkWithSpinner>
            </>
          )}

          <LinkWithSpinner
            href="/orders"
            className="flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 group hover:bg-primary hover:text-primary-foreground"
          >
            <Tags
              size={20}
              className="text-muted-foreground group-hover:text-inherit transition-colors"
            />
            <span className="font-medium text-inherit">{t("my_orders")}</span>
          </LinkWithSpinner>
        </div>

        <CollapsibleSection
          title={t("categories")}
          icon={ShoppingBag}
          isOpen={openCategories}
          setIsOpen={setOpenCategories}
        >
          {categories.map((category) => (
            <LinkWithSpinner
              key={category.id}
              href={`/category/${category.id}`}
              className="block p-2 rounded-md text-muted-foreground hover:text-primary-foreground hover:bg-primary/80 transition-colors text-sm"
            >
              {category.name}
            </LinkWithSpinner>
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title={t("brands")}
          icon={Bookmark}
          isOpen={openBrands}
          setIsOpen={setOpenBrands}
        >
          {brands.map((brand) => (
            <LinkWithSpinner
              key={brand.id}
              href={`/brand/${brand.id}`}
              className="flex items-center gap-2 p-2 rounded-md text-muted-foreground hover:text-primary-foreground hover:bg-primary/80 transition-colors text-sm"
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                  {brand.name[0]}
                </div>
              )}
              <span>{brand.name}</span>
            </LinkWithSpinner>
          ))}
        </CollapsibleSection>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          {t("footer")}
        </p>
      </div>
    </div>
  );
};

const CollapsibleSection = ({
  title,
  icon: Icon,
  isOpen,
  setIsOpen,
  children,
}: any) => (
  <div className="py-2 border-t border-border">
    <button
      className="w-full flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-accent/50 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className="font-semibold text-foreground flex items-center gap-3">
        <Icon size={18} className="text-primary" />
        {title}
      </h3>
      {isOpen ? (
        <ChevronUp size={18} className="text-muted-foreground" />
      ) : (
        <ChevronDown size={18} className="text-muted-foreground" />
      )}
    </button>
    {isOpen && <div className="mt-1 space-y-1 pr-6">{children}</div>}
  </div>
);

export default ContentSidebar;