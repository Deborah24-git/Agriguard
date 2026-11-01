import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((request) => {
  if (request.auth) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/points/:path*",
    "/sensors/:path*",
    "/alerts/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
