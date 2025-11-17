"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateProductQuantity } from "@/actions/product.action";

interface UpdateQuantityFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: {
    id: string;
    name: string;
    quantity: number;
  };
  onQuantityUpdated: (productId: string, newQuantity: number) => void;
}

export function UpdateQuantityForm({
  isOpen,
  onOpenChange,
  product,
  onQuantityUpdated,
}: UpdateQuantityFormProps) {
  const t = useTranslations("MyProductsPage");
  const [adjustment, setAdjustment] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = async () => {
    if (adjustment === 0) {
      toast.info(t("noChangeInQuantity"));
      return;
    }

    if (product.quantity + adjustment < 0) {
      toast.error(t("quantityCannotBeNegative"));
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProductQuantity({
          productId: product.id,
          adjustment,
        });

        if (result.success && result.newQuantity !== undefined) {
          toast.success(t("quantityUpdateSuccess"));
          onQuantityUpdated(product.id, result.newQuantity);
          onOpenChange(false); // إغلاق النافذة
        } else {
          toast.error(result.error || t("quantityUpdateError"));
        }
      } catch (error) {
        toast.error(t("quantityUpdateError"));
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t("updateQuantityFor")} &quot;{product.name}&quot;
          </DialogTitle>
          <DialogDescription>
            {t("currentQuantity")}: {product.quantity}. {t("enterAdjustment")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(parseInt(e.target.value, 10) || 0)}
            placeholder="+10 or -5"
            className="text-center text-lg"
          />
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isPending}>
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? t("updating") : t("confirmUpdate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}