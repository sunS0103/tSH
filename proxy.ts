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
  "/qa-job-fair-feb",
  "/assessment",
  "/assessment/*",
];

const ROLE_ONLY_ROUTES = {
  RECRUITER: ["/talent-pool", "/credits"],
  CANDIDATE: [],
};

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip static files and Next.js internals
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.includes(".") // Skip files with extensions
//   ) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get("token")?.value;
//   const role = request.cookies.get("user_role")?.value;

//   // Root redirect
//   if (pathname === "/") {
//     const userRole = request.cookies.get("user_role")?.value;
//     if (userRole === "CANDIDATE") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     } else if (userRole === "RECRUITER") {
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//     return NextResponse.next();
//   }

//   if (role) {
//     const forbiddenRoutes = Object.entries(ROLE_ONLY_ROUTES)
//       .filter(([r]) => r !== role)
//       .flatMap(([, routes]) => routes);

//     if (forbiddenRoutes.some((route) => pathname.startsWith(route))) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   // Allow public routes without token
//   if (!token && publicRoutes.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // Prevent logged-in user accessing auth
//   if (token && pathname.startsWith("/authentication")) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // Protect private routes
//   if (!token) {
//     return NextResponse.redirect(new URL("/authentication", request.url));
//   }

//   const response = NextResponse.next();

//   // Add headers to prevent caching of protected routes
//   response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   response.headers.set("Pragma", "no-cache");
//   response.headers.set("Expires", "0");

//   return response;
// }

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("user_role")?.value;

  // 2. Precise Public Route Matching
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith("/*")) {
      const base = route.slice(0, -2);
      // Matches "/assessment" and "/assessment/123" but NOT "/assessments"
      return pathname === base || pathname.startsWith(`${base}/`);
    }
    return pathname === route;
  });

  // 3. Authenticated User Redirection (Root or Auth page)
  if (token) {
    if (pathname === "/" || pathname.startsWith("/authentication")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 4. Public Route Access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 5. Protection: If not public and no token, go to auth
  if (!token) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  // 6. Role-Based Access Control (RBAC)
  if (role) {
    const forbiddenRoutes = Object.entries(ROLE_ONLY_ROUTES)
      .filter(([r]) => r !== role)
      .flatMap(([, routes]) => routes);

    // Use exact or startsWith logic here depending on if role routes have sub-paths
    if (forbiddenRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 7. Final response for authorized private routes
  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}
