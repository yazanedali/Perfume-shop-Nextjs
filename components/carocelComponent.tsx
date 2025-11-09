"use client";
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import Image from "next/image";
import { useLocale } from 'next-intl'; 
import { HeroSlide } from '../interfaces';

interface CarouselComponentProps {
  slides: HeroSlide[]; 
}

function CarouselComponent({ slides }: CarouselComponentProps) {
  // --- 2. الحصول على اللغة الحالية ---
  const locale = useLocale();

  // --- 3. تحديد اتجاه العرض بناءً على اللغة ---
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  if (!slides || slides.length === 0) {
    return null; 
  }

  return (
    <section className="container mx-auto px-0">
      <Carousel
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        opts={{ 
          // --- 4. تمرير الاتجاه إلى خيارات الكاروسيل ---
          direction: direction, 
          align: "start", 
          loop: true,
          breakpoints: {
            '(max-width: 640px)': { 
              align: 'center',
              dragFree: true 
            }
          }
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square sm:aspect-[16/9] md:aspect-[2.4/1] w-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover brightness-50"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 sm:p-6 space-y-2 sm:space-y-4 bg-black/20">
                  <motion.h1
                    className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold tracking-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    className="text-sm sm:text-lg md:text-xl max-w-xs sm:max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    <Link
                      href={slide.href}
                      className="inline-block bg-primary text-primary-foreground px-4 py-2 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-lg hover:bg-primary/90 transition-transform hover:scale-105 duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex left-4 sm:left-8" />
        <CarouselNext className="hidden sm:flex right-4 sm:right-8" />
      </Carousel>
    </section>
  );
}

export default CarouselComponent;