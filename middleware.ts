import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getSessionFromRequest, SESSION_COOKIE } from "@/lib/auth";

const protectedTravellerRoutes = [
  "/dashboard",
  "/destinations",
  "/itineraries",
  "/attractions",
];

const protectedAdminRoutes = [
  "/admin",
  "/admin/attractions",
  "/admin/itineraries",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith("/authentication") || pathname.startsWith("/api/auth");

  if (isAuthRoute) {
    return NextResponse.next();
  }

  const session = getSessionFromRequest(request);

  const isTravellerRoute = protectedTravellerRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAdminRoute = protectedAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!session) {
    if (isTravellerRoute || isAdminRoute) {
      const loginUrl = new URL("/authentication/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (isAdminRoute && session.role !== "admin") {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (
    isTravellerRoute &&
    session.role !== "traveller" &&
    session.role !== "admin"
  ) {
    const loginUrl = new URL("/authentication/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
