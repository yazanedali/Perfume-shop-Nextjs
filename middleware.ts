import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;

  // إذا كان المسار هو "/" فقط
  if (pathname === "/") {
    const locale = "en"; // حط اللغة الافتراضية تبعك
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next).*)"],
};