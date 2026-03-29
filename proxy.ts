import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-dev" 
  });
  const { pathname } = req.nextUrl;

  // 1. Define sensitive prefixes
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const isSpecialistPath = pathname.startsWith("/dashboard/specialist");
  const isParentPath = pathname.startsWith("/dashboard/parent");
  const isAuthRequired = isAdminPath || isSpecialistPath || isParentPath || pathname.startsWith("/report");

  // 2. FORCE REDIRECT FOR AUTHENTICATED USERS AWAY FROM LOGIN
  // If the user reaches /login but they are ALREADY authenticated, send them to their dashboard.
  // This resolves the "stall" seen in screenshots where the user is logged in but stuck on /login.
  if (token && (pathname === "/login" || pathname === "/register")) {
    const role = (token.role as string)?.toUpperCase()?.trim();
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    } else if (role === "SPECIALIST") {
      return NextResponse.redirect(new URL("/dashboard/specialist", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard/parent", req.url));
    }
  }

  // 3. Protect sensitive areas
  if (isAuthRequired && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-based unauthorized access protection
  if (token) {
    const role = (token.role as string)?.toUpperCase()?.trim();

    if (isAdminPath && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isSpecialistPath && role !== "SPECIALIST" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
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
