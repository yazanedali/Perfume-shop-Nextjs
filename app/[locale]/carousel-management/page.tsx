import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getAllHeroSlidesAction } from "@/actions/hero.action";
import { CarouselClient } from './_components/CarouselClient';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AddCarouselSlideForm } from './_components/AddCarouselSlideForm';

interface Props {
  params: Promise<{ locale: string }>;
}

const CarouselManagementPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CarouselManagement" });
  const slides = await getAllHeroSlidesAction();


  return (
    <div
      className="container mx-auto p-4 sm:p-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            {t("title")}
          </h1>
          {/* Mobile Stats */}
          <div className="sm:hidden flex items-center gap-2 text-sm">
            <span
              className="px-2 py-1 rounded-full"
              style={{
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              {slides.length} {t("slides_count")}
            </span>
          </div>
        </div>
        
        {/* Desktop Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <span style={{ color: "var(--muted-foreground)" }} className="text-sm">
            {slides.length} {t("slides_count")}
          </span>
          <AddCarouselSlideForm />
        </div>

        {/* Mobile Add Button */}
        <div className="sm:hidden">
          <AddCarouselSlideForm />
        </div>
      </div>
      
      {/* Content */}
      <div
        className="rounded-lg border shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        }}
      >
        <CarouselClient slides={slides} />
      </div>
    </div>
  );
};

export default CarouselManagementPage;