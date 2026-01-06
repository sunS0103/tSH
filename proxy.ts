import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/authentication",
  "/favicon.ico",
  "/auth.png",
  "/Logo.svg",
  "/anticipation",
  "/for-candidates",
  "/for-recruiters",
];

const ROLE_ONLY_ROUTES = {
  RECRUITER: ["/talent-pool", "/credits"],
  CANDIDATE: [],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;

  // Root redirect
  if (pathname === "/") {
    const userRole = request.cookies.get("user_role")?.value;
    if (userRole === "CANDIDATE") {
      return NextResponse.redirect(new URL("/profile", request.url));
    } else if (userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

    if (role) {
    const forbiddenRoutes = Object.entries(ROLE_ONLY_ROUTES)
      .filter(([r]) => r !== role)
      .flatMap(([, routes]) => routes);

    if (forbiddenRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow public routes without token
  if (!token && publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Prevent logged-in user accessing auth
  if (token && pathname.startsWith("/authentication")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect private routes
  if (!token) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  return NextResponse.next();
}