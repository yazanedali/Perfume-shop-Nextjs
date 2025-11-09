"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

interface LinkWithSpinnerProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const LinkWithSpinner = ({
  href,
  className = "",
  children,
  onClick,
}: LinkWithSpinnerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent) => {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      e.preventDefault();
      return;
    }

    setIsLoading(true);
    onClick?.();

    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return (
    <Link
      href={href}
      className={`relative ${className}`}
      onClick={handleClick}
      passHref
    >
      {children}
      {isLoading && (
        <Loader2
          className="absolute top-1/2 mx-[2px] -translate-y-1/2 h-5 w-5 animate-spin 
               ltr:right-0 rtl:left-0"
        />
      )}
    </Link>
  );
};
