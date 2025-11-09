import { getPendingSellerRequests } from "@/actions/user.action";
import { TableRequests } from "@/components/TableRequests";
import React from "react";

const Page = async () => {
  const pendingRequests = await getPendingSellerRequests();

  return (
    <div>
      <TableRequests requests={pendingRequests} />
    </div>
  );
};

export default Page;
