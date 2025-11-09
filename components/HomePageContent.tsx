// // components/HomePageContent.tsx

// "use client";

// import { Link } from "@/i18n/navigation";
// import { useTranslations } from "next-intl";
// import { Card, CardContent } from "@/components/ui/card";
// import { FaStar } from "react-icons/fa";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import ProductGrid from "@/components/ProductGrid";
// import AddProductForm from "@/components/AddProductForm";
// import AddBrandForm from "@/components/AddBrandForm";
// import { ICategory } from "@/interfaces";
// import Autoplay from "embla-carousel-autoplay";
// import Image from "next/image";
// import { motion } from "framer-motion";

// type Product = {
//   brand: {
//     name: string;
//   };
// } & {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
//   categoryId: string;
//   brandId: string;
// };

// interface HomePageContentProps {
//   products: Product[];
//   categories: ICategory[];
//   userId?: string;
// }

// const SectionHeader = ({ title }: { title: string }) => (
//   <motion.div
//     className="flex items-center justify-center mb-10 text-center"
//     initial={{ opacity: 0, y: 20 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.5 }}
//   >
//     <div className="flex items-center gap-4 py-2 px-6 bg-accent/20 rounded-full border border-border">
//       <FaStar className="text-primary text-xl" />
//       <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
//         {title}
//       </h2>
//       <FaStar className="text-primary text-xl" />
//     </div>
//   </motion.div>
// );

// export default function HomePageContent({
//   products,
//   categories,
//   userId,
// }: HomePageContentProps) {
//   const t = useTranslations("HomePage");

//   const isAdmin = userId === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

//   const heroSlides = [
//     {
//       image:
//         "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2700",
//       title: t("heroTitle"),
//       subtitle: t("heroSubtitle"),
//       buttonText: t("shopNow"),
//       href: "/shop",
//     },
//     {
//       image:
//         "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/194944s.jpg",
//       title: t("heroSlide2.title"),
//       subtitle: t("heroSlide2.subtitle"),
//       buttonText: t("heroSlide2.buttonText"),
//       href: "/collections/summer",
//     },
//   ];
//   // ------------------------------------

//   return (
//     <div className="space-y-20 sm:space-y-28 pb-20">


//       <section className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <SectionHeader title={t("featuredProducts")} />
//         <ProductGrid products={products} />
//       </section>

//       {isAdmin && (
//         <section className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-card border-2 border-dashed border-primary/50 rounded-lg p-6 sm:p-8">
//             <h2 className="text-2xl font-bold text-primary mb-6 text-center">
//               {t("adminPanelTitle")}
//             </h2>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//               <AddProductForm categories={categories} userId={userId!} />
//               <AddBrandForm userId={userId!} />
//             </div>
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }
