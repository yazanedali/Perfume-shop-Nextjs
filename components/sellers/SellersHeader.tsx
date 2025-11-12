import { useTranslations } from "next-intl";

export default function SellersHeader() {
  const t = useTranslations("SellersManagement");

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {t("title")}
      </h1>
      <p className="text-muted-foreground">
        {t("subtitle")}
      </p>
    </div>
  );
}