"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ISellerRequest } from "@/interfaces";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RequestDialogProps {
  request: ISellerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, status: string) => void;
}

export const RequestDialog: React.FC<RequestDialogProps> = ({
  request,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [status, setStatus] = useState("PENDING");
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setChanged(false);
    }
  }, [request]);

  if (!request) return null;

  const handleSave = () => {
    onConfirm(request.id, status);
    setChanged(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {request.name}
          </DialogTitle>
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <strong>Description:</strong>{" "}
                {request.description || "No description"}
              </div>
              <div>
                <strong>Address:</strong> {request.address || "No address"}
              </div>
              <div>
                <strong>Phone:</strong> {request.phone || "N/A"}
              </div>
              <div>
                <strong>Owner:</strong> {request.user.name}
              </div>
              <div className="sm:col-span-2">
                <strong>Email:</strong> {request.user.email}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-1">Status</label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setChanged(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {changed && <Button onClick={handleSave}>Confirm</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
