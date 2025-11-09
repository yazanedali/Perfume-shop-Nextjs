// "use client";

// import Image from "next/image";
// import { Link } from "@/i18n/navigation";
// import { FiShoppingCart, FiLogIn } from "react-icons/fi";
// import LocaleSwitcher from "./LocaleSwitcher";
// import { ModeToggle } from "./TogleMode";
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
// import { Gem, Shield, UserCheck } from "lucide-react";

// interface AppBarClientProps {
//   t: any; // ترجمة جاهزة من السيرفر
//   role: "CLIENT" | "SELLER" | "ADMIN";
// }

// export default function AppBarClient({ t, role }: AppBarClientProps) {
//   return (
//     <>
//       {/* Desktop Version */}
//       <div className="hidden md:flex items-center justify-between py-3 gap-6">
//         <Link
//           href="/"
//           className="flex items-center gap-3 group shrink-0"
//           aria-label="Home"
//         >
//           <div className="relative w-10 h-10">
//             <Image
//               src="/logo.svg"
//               alt="Logo"
//               width={40}
//               height={40}
//               className="object-contain"
//             />
//           </div>
//           <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
//             {t("storeName")}
//           </span>
//         </Link>

//         <div className="flex items-center gap-4">
//           <SignedIn>
//             <div className="flex items-center gap-4">
//               {role === "CLIENT" && (
//                 <Link
//                   href="/premium"
//                   className="flex items-center gap-1 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
//                   aria-label={t("premium")}
//                 >
//                   <Gem size={16} />
//                   {t("premium")}
//                 </Link>
//               )}

//               {role === "SELLER" && (
//                 <div className="flex items-center gap-1 text-sm font-medium text-green-600">
//                   <UserCheck size={16} />
//                   <span>{t("seller")}</span>
//                 </div>
//               )}

//               {role === "ADMIN" && (
//                 <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
//                   <Shield size={16} />
//                   <span>{t("admin")}</span>
//                 </div>
//               )}

//               <UserButton afterSignOutUrl="/" />
//             </div>
//           </SignedIn>
//           <SignedOut>
//             <Link
//               href="/premium"
//               className="flex items-center gap-1 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors mr-2"
//               aria-label={t("premium")}
//             >
//               <Gem size={16} />
//               {t("premium")}
//             </Link>

//             <SignInButton mode="modal">
//               <button
//                 className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent transition-colors text-sm font-medium"
//                 aria-label={t("signIn")}
//               >
//                 <FiLogIn size={18} />
//                 <span className="hidden sm:inline">{t("signIn")}</span>
//               </button>
//             </SignInButton>
//           </SignedOut>

//           <Link
//             href="/cart"
//             className="relative p-2 rounded-full hover:bg-accent transition-colors"
//             aria-label={t("cart")}
//           >
//             <FiShoppingCart size={20} />
//             <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
//               2
//             </span>
//           </Link>
//           <LocaleSwitcher />
//           <ModeToggle />
//         </div>
//       </div>

//       {/* Mobile Version */}
//       <div className="md:hidden flex items-center justify-between py-3 gap-4">
//         <Link
//           href="/"
//           className="flex items-center gap-2 shrink-0"
//           aria-label="Home"
//         >
//           <div className="relative w-8 h-8">
//             <Image
//               src="/logo.svg"
//               alt="Logo"
//               width={32}
//               height={32}
//               className="object-contain"
//             />
//           </div>
//           <span className="text-lg font-bold text-foreground">
//             {t("storeName")}
//           </span>
//         </Link>

//         <div className="flex items-center gap-3">
//           <Link
//             href="/premium"
//             className="flex items-center p-1.5 text-amber-500 hover:text-amber-400 transition-colors"
//             aria-label={t("premium")}
//           >
//             <Gem size={18} />
//           </Link>

//           <SignedIn>
//             {role === "SELLER" && (
//               <div className="p-1.5 text-green-600" title={t("seller")}>
//                 <UserCheck size={18} />
//               </div>
//             )}

//             {role === "ADMIN" && (
//               <div className="p-1.5 text-purple-600" title={t("admin")}>
//                 <Shield size={18} />
//               </div>
//             )}
//           </SignedIn>
//           <LocaleSwitcher />
//           <ModeToggle />
//         </div>
//       </div>
//     </>
//   );
// }
