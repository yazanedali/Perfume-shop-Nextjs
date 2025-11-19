"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OrderFormSchema } from "@/schema";
import { useTranslations } from "next-intl";
import Spinner from "../spinner";
import { addOrderItems, createOrder } from "@/actions/order.action";
import { Terminal } from "lucide-react";

const AddOrderForm = ({
  userId,
  total,
  items,
  onOrderSuccess,
}: {
  userId: string | "";
  total: number;
  items: {
    id: string;
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    maxQuantity: number;
  }[];
  onOrderSuccess?: () => void;
}) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const form = useForm({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      address: "",
      Phone: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (
    values: z.infer<typeof OrderFormSchema>
  ): Promise<void> => {
    setLoading(true);

    try {
      const orderId = await createOrder(
        userId as string,
        values.address,
        values.Phone as number,
        total
      );
      await Promise.all(
        items.map((item) =>
          addOrderItems(orderId, item.productId, item.quantity, item.price)
        )
      );

      setSuccessMessage(true);
      form.reset();

      // إغلق الـ Dialog و مسح السلة بعد ثانية
      setTimeout(() => {
        setIsOpen(false);
        setSuccessMessage(false);
        onOrderSuccess?.();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert(t("AddOrderForm.orderError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl font-medium mt-6 transition duration-200">
          {t("AddOrderForm.confirmOrder")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("AddOrderForm.fillOrder")}</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          {successMessage ? (
            <Alert variant="default" className="border-green-500 bg-green-50">
              <Terminal className="text-green-600" />
              <AlertTitle className="text-green-600">
                {t("AddOrderForm.orderSuccess")}
              </AlertTitle>
              <AlertDescription>
                {t("AddOrderForm.closingWindow")}
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("AddOrderForm.address")}</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder={t("AddOrderForm.addressPlaceholder")}
                          className="w-full border rounded-md p-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("AddOrderForm.phone")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          placeholder={t("AddOrderForm.phonePlaceholder")}
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : String(field.value)
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : Number(val)
                            );
                          }}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Spinner /> {t("AddOrderForm.saving")}
                    </>
                  ) : (
                    t("AddOrderForm.save")
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderForm;