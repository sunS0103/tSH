// proxy.ts (root of project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/authentication",
  "/authentication/login",
  "/authentication/register",
  "/favicon.ico",
  "/auth.png",
  "/Logo.svg",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow public routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // read token from cookies (server side)
  const token = request.cookies.get("token")?.value;

  // if no token, redirect
  if (!token) {
    const loginUrl = new URL("/authentication", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// optional matcher to control where proxy runs
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
