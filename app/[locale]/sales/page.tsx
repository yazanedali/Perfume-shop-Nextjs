import React from "react";
import { getUserRole } from "@/lib/useUserRole";
import MainSalsePage from "./MainSalsePage";

export default async function OrdersPage() {
  const { userId } = await getUserRole();

  return (
    <div>
      <MainSalsePage userId={userId} />
    </div>
  );
}
