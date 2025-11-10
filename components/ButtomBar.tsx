"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, ShoppingCart, User, Gem, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// --- المكون المعدل مع الـ counter ---
const BottomNavItem = ({ href, label, icon: Icon, isActive, id, counter = 0 }: any) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-16">
      <Link
        href={href}
        aria-label={label}
        className={cn(
          "flex flex-col items-center justify-center h-full w-full transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
        id={id}
      >
        <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
        
        {/* إضافة الـ counter */}
        {counter > 0 && (
          <span className="absolute -top-0.5 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {counter}
          </span>
        )}
      </Link>
    </div>
  );
};

// --- Props جديدة للـ BottomBar ---
interface BottomBarProps {
  counterItems?: number;
}

export default function BottomBar({ counterItems = 0 }: BottomBarProps) {
  const t = useTranslations("BottomBar");
  const pathname = usePathname();

  const leftItems = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/orders", label: t("my_orders"), icon: Package },
  ];
  
  const cartItem = { 
    href: "/cart", 
    label: t("cart"), 
    icon: ShoppingCart,
    id: "mobile-cart-icon",
    counter: counterItems // ← نمرر الـ counter هنا
  };

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
            <div
              aria-label={t("discover")}
              className="relative -mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-110"
            >
              <Gem size={32} className="text-primary-foreground" />
            </div>
        </div>

        {/* العناصر على اليمين */}
        <div className="col-span-2 flex items-center justify-around h-full">
          {/* عنصر السلة مع الـ counter */}
          <BottomNavItem
            href={cartItem.href}
            label={cartItem.label}
            icon={cartItem.icon}
            isActive={pathname === cartItem.href}
            id={cartItem.id}
            counter={cartItem.counter} // ← نمرر الـ counter
          />
          
          {/* عنصر "حسابي" */}
          <div className="flex items-center justify-center h-full w-16">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
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