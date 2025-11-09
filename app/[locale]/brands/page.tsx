import { getSellers } from "@/actions/brand.action";
import { updateProductLimit } from "@/actions/product.action";
import BrandsTable from "@/components/BrandsTable";

export default async function Page() {
  const sellers = await getSellers();

  const mappedSellers = sellers.map((seller) => ({
    sellerName: seller.sellerName,
    sellerEmail: seller.sellerEmail,
    productLimit: seller.productLimit,
    brandCount: seller.brandCount,
    productCount: seller.productCount,
    ownerLogo: seller.ownerLogo,
  }));

  return <BrandsTable sellers={mappedSellers} />;
}
