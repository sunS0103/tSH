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

  // Root redirect
  if (pathname === "/") {
    if (token) {
      const roles = request.cookies.get("user_roles")?.value;
      if (roles === "candidate") {
        return NextResponse.redirect(new URL("/assessments", request.url));
      } else if (roles === "recruiter") {
        return NextResponse.redirect(new URL("/jobs", request.url));
      }
      return NextResponse.redirect(new URL("/assessments", request.url));
    }
    return NextResponse.next();
  }

  // Allow public routes without token
  if (!token && publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Prevent logged-in user accessing auth
  if (token && pathname.startsWith("/authentication")) {
    return NextResponse.redirect(new URL("/assessments", request.url));
  }

  // Protect private routes
  if (!token) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  return NextResponse.next();
}
