import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token as any)?.role;

    // Role-based access control for dashboard routes
    // Both ADMIN and SUPER_ADMIN can access admin dashboard
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Specialists and Admins can access specialist dashboard
    if (pathname.startsWith("/dashboard/specialist") && role !== "SPECIALIST" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // Anyone authenticated can access parent dashboard (general features)
    if (pathname.startsWith("/dashboard/parent") && !role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Redirection should be allowed without token for domain forwarding
        // but dashboard/booking/etc still require token
        const { pathname } = req.nextUrl;
        const authRequiredPaths = ["/dashboard", "/booking", "/telehealth", "/report"];
        const isAuthPath = authRequiredPaths.some(p => pathname.startsWith(p));

        if (isAuthPath) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

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
