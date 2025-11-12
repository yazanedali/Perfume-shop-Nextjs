import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Store, Users, Package } from "lucide-react";
import { BrandData } from "@/interfaces/index";

interface SellersTableProps {
  sellers: BrandData[];
  limits: Record<string, number>;
  onLimitChange: (email: string, value: number) => void;
  onOpenDetailPopup: (seller: BrandData) => void;
  onOpenLimitPopup: (seller: BrandData) => void;
}

export default function SellersTable({
  sellers,
  limits,
  onLimitChange,
  onOpenDetailPopup,
  onOpenLimitPopup,
}: SellersTableProps) {
  const t = useTranslations("SellersManagement");

  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-border shadow-sm">
      <Table 
        aria-label="Brands Table" 
        className="min-w-[800px] bg-card"
        selectionMode="single"
      >
        <TableHeader className="bg-primary/5">
          <TableColumn className="text-sm font-semibold text-foreground py-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("brandCount")}
            </div>
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            {t("logo")}
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            {t("ownerName")}
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            {t("ownerEmail")}
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t("products")}
            </div>
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            {t("productLimit")}
          </TableColumn>
          <TableColumn className="text-sm font-semibold text-foreground">
            {t("actions")}
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {t("noSellers")}
              </p>
            </div>
          }
        >
          {sellers.map((seller) => (
            <TableRow 
              key={seller.sellerEmail} 
              className="hover:bg-accent/10 transition-colors cursor-pointer"
              onClick={() => onOpenDetailPopup(seller)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{seller.brandCount}</span>
                </div>
              </TableCell>
              <TableCell>
                {seller.ownerLogo ? (
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-border">
                    <Image
                      src={seller.ownerLogo}
                      alt={`${seller.sellerName} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-lg border border-border">
                    <Store className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="font-medium text-foreground">{seller.sellerName}</span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">{seller.sellerEmail}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    seller.productCount >= seller.productLimit 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {seller.productCount}
                  </span>
                </div>
              </TableCell>
              <TableCell>
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
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    onClick={() => onOpenLimitPopup(seller)}
                  >
                    {t("update")}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}