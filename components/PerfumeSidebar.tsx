import { getCategoryListActions } from "@/actions/category.action";
import ContentSidebar from "./contentSidebar";
import { getBrandListActions } from "@/actions/brand.action";
import { getUserRole } from "@/lib/useUserRole";

export default async function PerfumeSidebar() {
  const categories = await getCategoryListActions();
  const brands = await getBrandListActions();
  const { userId, role } = await getUserRole();
  return <ContentSidebar categories={categories} brands={brands} role={role} />;
}
