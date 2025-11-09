"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { premiumAccountFormSchema } from "@/schema";
import Spinner from "./spinner";
import { addPrimumAccountAction } from "@/actions/user.action";

const AddPremiumAccount = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [Isclose, setIsclose] = useState(false);

  // <-- 1. تم تعديل القيم الافتراضية لتشمل حقل الصورة
  const form = useForm({
    resolver: zodResolver(premiumAccountFormSchema),
    defaultValues: {
      storeName: "",
      description: "",
      Phone: undefined,
      address: "",
      image: undefined, 
    },
    mode: "onChange",
  });

  // <-- 2. تم تحديث دالة onSubmit لتقوم برفع الصورة أولاً
  const onSubmit = async (
    values: z.infer<typeof premiumAccountFormSchema>
  ): Promise<void> => {
    setLoading(true);

    try {
      let logoUrl = "";


      if (values.image) {
        const formData = new FormData();

        formData.append("image", values.image);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to upload image");

        logoUrl = data.url;
      }

      const response = await addPrimumAccountAction({
        userId,
        storeName: values.storeName,
        description: values.description,
        phone: values.Phone,
        address: values.address,
        logoUrl: logoUrl,
      });

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert(response.message);
      form.reset(); // إعادة تعيين الحقول بعد النجاح
      setIsclose(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Isclose} onOpenChange={setIsclose}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center">
          <Plus className="mr-2" />
          Request Premium Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Become a Seller</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a seller account.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* باقي الحقول تبقى كما هي */}
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <-- 3. تم إضافة حقل رفع صورة الشعار */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Store Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={(e) => onChange(e.target.files?.[0])}
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Phone Number"
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : String(field.value)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Spinner /> Submitting...
                  </>
                ) : (
                  "Submit Request"
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

export default AddPremiumAccount;