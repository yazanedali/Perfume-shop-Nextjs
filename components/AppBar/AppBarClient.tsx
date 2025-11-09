"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "../LocaleSwitcher";
import { ModeToggle } from "../TogleMode";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Gem, Shield, UserCheck, ShoppingCart, LogIn } from "lucide-react";
import { FiLogIn, FiShoppingCart } from "react-icons/fi";

type AppBarClientProps = {
  role: string;
  t: {
    storeName: string;
    premium: string;
    seller: string;
    admin: string;
    signIn: string;
    cart: string;
    sellerPanel: string;
    adminPanel: string;
  };
  counterItems: number;
};

export default function AppBarClient({
  role,
  t,
  counterItems,
}: AppBarClientProps) {
  return (
    <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Version */}
        <div className="hidden md:flex items-center justify-between py-3 gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            aria-label="Home"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {t.storeName}
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Premium للمستخدمين غير المسجلين أو المسجلين كـ CLIENT */}
            <SignedOut>
              <Link
                href="/premium"
                className="flex items-center gap-1 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
                aria-label={t.premium}
              >
                <Gem size={16} />
                {t.premium}
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                {/* Premium للمستخدمين المسجلين كـ CLIENT فقط */}
                {role === "CLIENT" && (
                  <Link
                    href="/premium"
                    className="flex items-center gap-1 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
                    aria-label={t.premium}
                  >
                    <Gem size={16} />
                    {t.premium}
                  </Link>
                )}

                {/* Seller للبائعين */}
                {role === "SELLER" && (
                  <Link
                    href="/premium"
                    className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                    aria-label={t.seller}
                  >
                    <UserCheck size={16} />
                    {t.seller}
                  </Link>
                )}

                {/* Admin للمدراء */}
                {role === "ADMIN" && (
                  <div
                    className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
                    aria-label={t.admin}
                  >
                    <Shield size={16} />
                    {t.admin}
                  </div>
                )}

                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            {/* سلة التسوق (للجميع في الدسكتوب) */}
            <Link
              href="/cart"
              id="cart-icon"
              className="relative p-2 rounded-full hover:bg-accent transition-colors"
              aria-label={t.cart}
            >
              <FiShoppingCart size={20} />
              {counterItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {counterItems}
                </span>
              )}
            </Link>

            {/* زر تسجيل الدخول للمستخدمين غير المسجلين */}
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium"
                  aria-label={t.signIn}
                >
                  <FiLogIn size={18} />
                  <span className="hidden sm:inline">{t.signIn}</span>
                </button>
              </SignInButton>
            </SignedOut>

            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Version - بدون سلة التسوق وبدون أيقونة الحساب */}
        <div className="md:hidden flex items-center justify-between py-3 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            aria-label="Home"
          >
            <div className="relative w-8 h-8">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold text-foreground">
              {t.storeName}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Premium للمستخدمين غير المسجلين أو المسجلين كـ CLIENT */}
            <SignedOut>
              <Link
                href="/premium"
                className="flex items-center p-1.5 text-amber-500 hover:text-amber-400 transition-colors"
                aria-label={t.premium}
              >
                <Gem size={18} />
              </Link>
            </SignedOut>

            <SignedIn>
              {/* Premium للمستخدمين المسجلين كـ CLIENT فقط */}
              {role === "CLIENT" && (
                <Link
                  href="/premium"
                  className="flex items-center p-1.5 text-amber-500 hover:text-amber-400 transition-colors"
                  aria-label={t.premium}
                >
                  <Gem size={18} />
                </Link>
              )}

              {/* Seller للبائعين */}
              {role === "SELLER" && (
                <Link
                  href="/premium"
                  className="p-1.5 text-green-600 hover:text-green-500 transition-colors"
                  title={t.seller}
                >
                  <UserCheck size={18} />
                </Link>
              )}

              {/* Admin للمدراء */}
              {role === "ADMIN" && (
                <div
                  className="p-1.5 text-purple-600 hover:text-purple-500 transition-colors"
                  title={t.admin}
                >
                  <Shield size={18} />
                </div>
              )}
              
              {/* ما في أيقونة حساب للمسجلين في التلفون */}
            </SignedIn>

            <LocaleSwitcher />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}