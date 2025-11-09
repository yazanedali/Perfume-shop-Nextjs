"use client";

import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ReactNode } from "react";

export default function CustomCarousel({ children }: { children: ReactNode }) {
  const plugin = Autoplay({ delay: 5000, stopOnInteraction: false });
  
  return (
    <Carousel 
      plugins={[plugin]}
      opts={{ align: "start", loop: true }}
      className="w-full"
    >
      {children}
    </Carousel>
  );
}