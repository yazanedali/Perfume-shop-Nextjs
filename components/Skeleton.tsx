import React from "react";

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-4">
    {Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className="w-full border-2 border-bg-primary rounded-2xl shadow-sm animate-pulse p-3">
        <div className="rounded-2xl w-full h-[150px] sm:h-[200px] md:h-[200px] bg-gray-200 dark:bg-gray-700" />
        <div className="pt-3 px-3 flex flex-col justify-between space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const BrandGridSkeleton = () => (
  <div className="flex flex-wrap justify-center gap-6 mt-10">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex flex-col items-center p-2">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
      </div>
    ))}
  </div>
);

export const HeroCarouselSkeleton = () => (
  <div className="relative aspect-square sm:aspect-[16/9] md:aspect-[2.4/1] w-full bg-gray-200 dark:bg-gray-700 animate-pulse">
    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4">
      <div className="h-8 sm:h-12 md:h-16 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 sm:h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-full w-32 animate-pulse"></div>
    </div>
  </div>
);

export const CategoryPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8 sm:py-12">
    <div className="text-center mb-8 sm:mb-12 space-y-4">
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse"></div>
    </div>
    <ProductGridSkeleton />
  </div>
);

export const HomePageSkeleton = () => (
  <div className="pb-10 animate-pulse">
    {/* هيكل الكاروسيل */}
    <div className="sm:p-14 p-7">
      <div className="relative aspect-square sm:aspect-[16/9] md:aspect-[2.4/1] w-full bg-gray-200 dark:bg-gray-700 rounded-xl">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4">
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-full w-32"></div>
        </div>
      </div>
    </div>

    {/* هيكل عنوان المنتجات المميزة */}
    <div className="flex items-center justify-center mb-6 space-x-2">
      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-4 mb-10">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="border-2 border-bg-primary rounded-2xl shadow-sm p-3">
          <div className="rounded-2xl w-full h-[150px] sm:h-[200px] md:h-[200px] bg-gray-200 dark:bg-gray-700"></div>
          <div className="pt-3 px-3 flex flex-col justify-between space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex flex-wrap justify-center gap-6 mt-10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center p-2">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);
