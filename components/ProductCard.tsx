"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaShoppingCart } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import { addToCart } from "@/actions/cart.action";
import { Link } from "@/i18n/navigation";

type Product = {
  brand: { name: string };
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  brandId: string;
  category?: { name: string };
};

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  animationDelay?: number;
  userId?: string;
}

export default function ProductCard({
  product,
  priority = false,
  animationDelay = 0,
  userId,
}: ProductCardProps) {
  const t = useTranslations("AddToCart");
  const [isHovered, setIsHovered] = useState(false);
  const [alert, setAlert] = useState<null | "login" | "added">(null);

  const AlertPortal = () => {
    if (!alert) return null;

    const isLogin = alert === "login";

    return createPortal(
      <Alert
        variant={isLogin ? "destructive" : "default"}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[300px]"
      >
        {isLogin ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {isLogin ? t("login_required") : t("added_to_cart")}
        </AlertTitle>
        <AlertDescription>
          {isLogin
            ? t("please_login_to_add_items")
            : t("product_added_successfully")}
        </AlertDescription>
      </Alert>,
      document.body
    );
  };

  const triggerCartAnimation = () => {
    // Desktop cart animation
    const desktopCartIcon = document.getElementById("desktop-cart-icon");
    if (desktopCartIcon) {
      desktopCartIcon.classList.add("cart-animate");
      setTimeout(() => desktopCartIcon.classList.remove("cart-animate"), 700);
    }

    // Mobile cart animation
    const mobileCartIcon = document.getElementById("mobile-cart-icon");
    if (mobileCartIcon) {
      mobileCartIcon.classList.add("cart-animate");
      setTimeout(() => mobileCartIcon.classList.remove("cart-animate"), 700);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      setAlert("login");
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    try {
      await addToCart(userId, product.id, 1);
      setAlert("added");
      
      // Trigger animation for both desktop and mobile
      triggerCartAnimation();
      
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <>
      <AlertPortal />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: animationDelay }}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md",
          product.quantity === 0 ? "cursor-not-allowed" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/product/${product.id}`}
          className={cn(
            "flex flex-col h-full",
            product.quantity === 0 ? "pointer-events-none" : ""
          )}
        >
          <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.brand?.name ?? "Unknown"}
            </h3>

            <h2 className="mt-1 text-sm font-semibold text-foreground line-clamp-2 h-8">
              {product.name}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 h-8">
              {product.description}
            </p>

            <div className="mt-auto flex items-center justify-between">
              <p className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              
              {/* زر السلة للشاشات الصغيرة */}
              <button
                type="button"
                aria-label="Add to cart"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className={cn(
                  "md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300",
                  product.quantity === 0 && "opacity-50 pointer-events-none"
                )}
              >
                <FaShoppingCart size={12} />
              </button>
            </div>
          </div>
        </Link>

        {/* زر السلة للشاشات الكبيرة */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className={cn(
            "hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300",
            "absolute bottom-3 right-3 rtl:right-auto rtl:left-3",
            isHovered ? "opacity-100" : "opacity-0",
            product.quantity === 0 ? "pointer-events-none opacity-50" : ""
          )}
        >
          <FaShoppingCart size={14} />
        </motion.button>

        {/* Overlay نفاذ الكمية */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none">
            <span className="text-lg font-bold text-red-600">نفاذ الكمية</span>
          </div>
        )}
      </motion.div>
    </>
  );
}