import { Link } from "@/i18n/navigation";
import React from "react";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string | null;
}

const BrandGrid = ({ brands }: { brands: Brand[] }) => {
  if (!brands || brands.length === 0) {
    return <p className="text-gray-500">لا يوجد براندات حالياً</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {brands.map((b) => (
        <Link href={`/brand/${b.id}`} key={b.id} className="flex flex-col items-center">
          <div
            className="flex flex-col items-center border-2 border-transparent hover:border-primary p-2 rounded-md transition-all"
          >
            {b.logoUrl ? (
            <img
              src={b.logoUrl}
              alt={b.name}
              className="w-20 h-20 object-contain rounded-full shadow-md border-2 border-transparent hover:border-primary"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full">
              {b.name}
            </div>
          )}
          <span className="mt-2 text-sm font-medium">{b.name}</span>
        </div>
        </Link>
      ))}
    </div>
  );
};

export default BrandGrid;