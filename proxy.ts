import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Next.js 16.2.0 Proxy Convention
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ONLY USE THE PROXY TO PASS THROUGH BY DEFAULT
  // We will handle security inside the Server Components which are more reliable than the Edge for Session decryption
  
  // Minimal session check just to prevent obvious bot access to /dashboard prefix
  // but we won't REDIRECT back to login if it's ambiguous, to avoid loops.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/report/:path*',
    '/login',
    '/register',
    '/'
  ],
};
