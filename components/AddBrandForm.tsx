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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { brandFormSchema } from "@/schema";
import Spinner from "./spinner";
import { createBrandActions } from "@/actions/brand.action";
import { useTranslations } from "next-intl";

const AddBrandForm = ({ userId }: { userId: string | "" }) => {
  const t = useTranslations("AddBrandForm");
  const [loading, setLoading] = useState(false);
  const [Isclose, setIsclose] = useState(false);

  const form = useForm({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof brandFormSchema>
  ): Promise<void> => {
    console.log("Form submitted", values);
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

        if (!res.ok) throw new Error(data.error || t("uploadError"));

        logoUrl = data.url;
      }
      await createBrandActions({
        name: values.name,
        logoUrl,
        ownerId: userId,
      });

      console.log("Form submitted successfully");
      setIsclose(false);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={Isclose} onOpenChange={setIsclose}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center">
          <Plus className="mr-2" />
          {t("addBrandButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto scroll-hide">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("nameLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("namePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ref, ...rest } }) => (
                  <FormItem>
                    <FormLabel>{t("imageLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={ref}
                        onChange={(e) => onChange(e.target.files?.[0])}
                        // Do not spread rest here to avoid passing value prop
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> {t("saving")}
                  </>
                ) : (
                  t("saveButton")
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

export default AddBrandForm;