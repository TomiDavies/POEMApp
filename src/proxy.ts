import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth-token';

const PUBLIC_PATHS = new Set(['/login']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const authed = verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (authed) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

// Proxy runs on every route except static assets. This is only the
// optimistic check — Route Handlers verify the session again themselves.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
