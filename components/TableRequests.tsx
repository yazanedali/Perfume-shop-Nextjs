"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISellerRequest } from "@/interfaces";
import { RequestDialog } from "./RequestDialog";
import { updateSellerRequestStatus } from "@/actions/user.action";
import { Alert } from "@heroui/react";

interface TableRequestsProps {
  requests: ISellerRequest[];
}

export function TableRequests({ requests }: TableRequestsProps) {
  const [selectedRequest, setSelectedRequest] = useState<ISellerRequest | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; message?: string }>({
    show: false,
  });

  const handleRowClick = (request: ISellerRequest) => {
    setSelectedRequest(request);
    setIsOpen(true);
  };

  const handleConfirm = async (id: string, status: string) => {
    try {
      await updateSellerRequestStatus(id, status as "APPROVED" | "REJECTED");
      setIsOpen(false);
      setAlert({
        show: true,
        message: `Request ${status.toLowerCase()} successfully!`,
      });

      setTimeout(() => setAlert({ show: false }), 3000);
    } catch (error) {
      setAlert({ show: true, message: `Failed to update request.` });
      setTimeout(() => setAlert({ show: false }), 3000);
    }
  };

  return (
    <>
      {alert.show && (
        <div className="bg-green-500 fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Alert color="success" title={alert.message!} />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow
              key={req.id}
              onClick={() => handleRowClick(req)}
              className="cursor-pointer hover:bg-gray-600"
            >
              <TableCell>{req.name}</TableCell>
              <TableCell>{req.user.name}</TableCell>
              <TableCell>{req.user.email}</TableCell>
              <TableCell>{req.phone || "N/A"}</TableCell>
              <TableCell>{req.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRequest && (
        <RequestDialog
          request={selectedRequest}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
