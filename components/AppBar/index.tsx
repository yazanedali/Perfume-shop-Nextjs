import { counterCartItems } from "@/actions/cart.action";
import { getUserRole } from "@/lib/useUserRole";
import { getTranslations } from "next-intl/server";
import AppBarClient from "./AppBarClient";

export default async function AppBar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "AppBar" });

  const { role, userId } = await getUserRole();

  // انتظر قيمة الـ Promise
  const counterItems = await counterCartItems(userId!);

  const translations = {
    storeName: t("storeName"),
    premium: t("premium"),
    seller: t("seller"),
    admin: t("admin"),
    signIn: t("signIn"),
    cart: t("cart"),
    sellerPanel: t("sellerPanel"),
    adminPanel: t("adminPanel"),
  };

  return (
    <AppBarClient role={role} t={translations} counterItems={counterItems} />
  );
}
