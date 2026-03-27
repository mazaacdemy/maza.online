import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const role = (req.nextauth.token as any)?.role;
    const host = req.headers.get('host');
    const productionHost = 'maza-online.vercel.app';

    // 1. Domain Redirection (Production Force)
    if (
      host &&
      host !== productionHost &&
      !host.startsWith('localhost') &&
      host.includes('vercel.app')
    ) {
      const url = req.nextUrl.clone();
      url.host = productionHost;
      url.protocol = 'https';
      return NextResponse.redirect(url, 301);
    }

    // 2. Role-based access control for dashboard routes
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/dashboard/specialist") && role !== "SPECIALIST" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/dashboard/parent") && role !== "PARENT" && role !== "ADMIN") {
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
