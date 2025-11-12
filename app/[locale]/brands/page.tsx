import { getSellersWithDetails } from "@/actions/brand.action";
import BrandsTable from "@/components/sellers/BrandsTable";

export default async function Page() {
  const sellers = await getSellersWithDetails();
  return <BrandsTable sellers={sellers} />;
}