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

import Spinner from "../spinner";
import { addOrderItems, createOrder } from "@/actions/order.action";
import { Terminal } from "lucide-react";

const AddOrderForm = ({
  userId,
  total,
  items,
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
}) => {
  const [loading, setLoading] = useState(false);
  const [Isclose, setIsclose] = useState(false);

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

      <Alert variant="default">
        <Terminal />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the cli.
        </AlertDescription>
      </Alert>;

      setIsclose(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Isclose} onOpenChange={setIsclose}>
      <DialogTrigger asChild>
        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-xl font-medium mt-6 transition duration-200">
          Confirm Order
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fill Order</DialogTitle>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Your address"
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Phone number"
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : String(field.value)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
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

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save ✅"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderForm;
