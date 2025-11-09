import React from "react";
import MainOrder from "./mainOrder";
import { getUserRole } from "@/lib/useUserRole";

export default async function OrdersPage() {
  const { userId } = await getUserRole();

  return (
    <div>
      {userId ? (
        <MainOrder userId={userId} />
      ) : (
        <p className="p-4 text-red-600">Please login to view your orders.</p>
      )}
    </div>
  );
}
