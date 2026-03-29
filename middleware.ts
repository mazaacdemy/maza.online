import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-dev" 
  });
  const { pathname } = req.nextUrl;

  // 1. Define protected prefixes
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const isSpecialistPath = pathname.startsWith("/dashboard/specialist");
  const isParentPath = pathname.startsWith("/dashboard/parent");
  const isAuthRequired = isAdminPath || isSpecialistPath || isParentPath || pathname.startsWith("/report");

  // 2. If no token and trying to access sensitive area, redirect to login
  if (isAuthRequired && !token) {
    const loginUrl = new URL("/login", req.url);
    // Don't append callbackUrl if we're already redirecting from login
    return NextResponse.redirect(loginUrl);
  }

  // 3. Permission checks
  if (token) {
    const role = (token.role as string)?.toUpperCase()?.trim();

    if (isAdminPath && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isSpecialistPath && role !== "SPECIALIST" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Authenticated users with no role (rare but possible) or PARENT role 
    // should still be able to access report/booking but not admin dashboards
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
