import { useTranslations } from "next-intl";
import Image from "next/image";
import { Store, Users, Package } from "lucide-react";
import { BrandData } from "@/interfaces/index";

interface SellersMobileViewProps {
  sellers: BrandData[];
  limits: Record<string, number>;
  onLimitChange: (email: string, value: number) => void;
  onOpenDetailPopup: (seller: BrandData) => void;
  onOpenLimitPopup: (seller: BrandData) => void;
}

export default function SellersMobileView({
  sellers,
  limits,
  onLimitChange,
  onOpenDetailPopup,
  onOpenLimitPopup,
}: SellersMobileViewProps) {
  const t = useTranslations("SellersManagement");

  return (
    <div className="grid gap-4 md:hidden">
      {sellers.map((seller) => (
        <div 
          key={seller.sellerEmail} 
          className="p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onOpenDetailPopup(seller)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {seller.ownerLogo ? (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-border">
                  <Image
                    src={seller.ownerLogo}
                    alt={`${seller.sellerName} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-lg border border-border">
                  <Store className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg text-foreground">{seller.sellerName}</h3>
                <p className="text-sm text-muted-foreground truncate">{seller.sellerEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{seller.brandCount}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                seller.productCount >= seller.productLimit 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {seller.productCount} {t("stats.products")}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("productLimit")}:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={limits[seller.sellerEmail]}
                  onChange={(e) =>
                    onLimitChange(seller.sellerEmail, Math.max(0, Number(e.target.value)))
                  }
                  className="border border-border rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  min="0"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLimitPopup(seller);
                  }}
                >
                  {t("update")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}