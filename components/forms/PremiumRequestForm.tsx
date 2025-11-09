"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import Spinner from "../spinner";
import { addPrimumAccountAction } from "@/actions/user.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


type SellerRequestProps = {
  id: string;
  name: string;
  description?: string | null;
  phone?: number | null;
  address?: string | null;
  logoUrl?: string | null;
};


const PremiumRequestForm = ({ userId, rejectedRequest }: { userId: string; rejectedRequest?: SellerRequestProps }) => {
  const t = useTranslations("PremiumPage.form");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(premiumAccountFormSchema),
    defaultValues: {
      storeName: rejectedRequest?.name || "",
      description: rejectedRequest?.description || "",
      Phone: rejectedRequest?.phone || undefined,
      address: rejectedRequest?.address || "",
      image: undefined,
    },
    mode: "onChange",
  });

const onSubmit = async (values: z.infer<typeof premiumAccountFormSchema>): Promise<void> => {
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
      await addPrimumAccountAction({
        userId,
        storeName: values.storeName,
        description: values.description,
        phone: values.Phone,
        address: values.address,
        logoUrl,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <CardTitle className="text-2xl mt-4">{t("successTitle")}</CardTitle>
          <CardDescription>
            {t("successDescription")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rejectedRequest && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("AlertTitle")}</AlertTitle>
            <AlertDescription>
              {t("AlertDescription")}
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("storeName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("storeName")} {...field} />
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
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("descriptionLabel")} {...field} />
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
                  <FormLabel>{t("storeLogo")}</FormLabel>
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
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder={t("phone")}
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
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("address")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Spinner /> {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PremiumRequestForm;
