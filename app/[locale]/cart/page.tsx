import { getUserRole } from "@/lib/useUserRole";
import React from "react";
import MainCart from "./mainCart";

export default async function Page() {
  const { userId, role } = await getUserRole();
  console.log(">> MainCart reached", { userId, role });

  return (
    <div>
      <MainCart userId={userId} />
    </div>
  );
}
