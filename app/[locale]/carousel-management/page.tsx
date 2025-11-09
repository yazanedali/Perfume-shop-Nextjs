import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getAllHeroSlidesAction } from "@/actions/hero.action";
import { CarouselClient } from './_components/CarouselClient';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AddCarouselSlideForm } from './_components/AddCarouselSlideForm';

interface Props {
  params: {
    locale: string;
  };
}

const CarouselManagementPage = async (props: Props) => {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "CarouselManagement" });

  const slides = await getAllHeroSlidesAction();

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("title")}
          </h1>
          {/* Mobile Stats */}
          <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {slides.length} {t("slides_count")}
            </span>
          </div>
        </div>
        
        {/* Desktop Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-gray-600">
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <CarouselClient slides={slides} />
      </div>
    </div>
  );
};

export default CarouselManagementPage;