"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, ShoppingCart, User, Gem, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
// --- استيراد مكونات Clerk المطلوبة ---
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// --- المكون الفرعي للأيقونات العادية (يبقى كما هو) ---
const BottomNavItem = ({ href, label, icon: Icon, isActive }: any) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center h-full w-16 transition-colors duration-200",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
    </Link>
  );
};

// --- المكون الرئيسي للشريط السفلي ---
export default function BottomBar() {
  const t = useTranslations("BottomBar");
  const pathname = usePathname();

  const leftItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/categories", label: t("categories"), icon: LayoutGrid },
  ];
  const cartItem = { href: "/cart", label: t("cart"), icon: ShoppingCart };

  return (
    <footer className="md:hidden fixed bottom-0 left-0 z-40 w-full h-16 bg-card border-t border-border sm:my-18">
      <div className="grid grid-cols-5 items-center justify-center h-full">
        
        {/* العناصر على اليسار */}
        <div className="col-span-2 flex items-center justify-around h-full">
          {leftItems.map((item) => (
            <BottomNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* الزر المركزي "الجوهرة" */}
        <div className="col-span-1 flex justify-center">
            <Link
              href="/discover"
              aria-label={t("discover")}
              className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-110"
            >
              <Gem size={32} className="text-primary-foreground" />
            </Link>
        </div>

        {/* --- هذا هو الجزء الذي تم تعديله بالكامل --- */}
        <div className="col-span-2 flex items-center justify-around h-full">
          {/* عنصر السلة يبقى كما هو */}
          <BottomNavItem
            href={cartItem.href}
            label={cartItem.label}
            icon={cartItem.icon}
            isActive={pathname === cartItem.href}
          />
          
          {/* عنصر "حسابي" الذي يطابق وظيفة AppBar */}
          <div className="flex items-center justify-center h-full w-16">
            <SignedIn>
              {/* عند تسجيل الدخول: تظهر صورة الحساب الفعلية */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              {/* عند الخروج: تظهر أيقونة تفتح نافذة التسجيل */}
              <SignInButton mode="modal">
                <button 
                  aria-label={t("account")}
                  className={cn(
                    "flex items-center justify-center h-full w-full transition-colors duration-200",
                    "text-muted-foreground hover:text-primary"
                  )}
                >
                  <User size={26} strokeWidth={2} />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </footer>
  );
}