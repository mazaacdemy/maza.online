import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host');
  const productionHost = 'maza-online.vercel.app';

  // Redirect only if it's a Vercel preview URL and not localhost
  // Note: if you have a custom domain (e.g. maza.online), add it to the exclusion list
  if (
    host && 
    host !== productionHost && 
    host !== 'localhost:3005' && 
    host !== 'localhost:3000' &&
    host.includes('vercel.app')
  ) {
    url.host = productionHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
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
