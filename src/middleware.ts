import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth');
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

  if (!auth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (auth && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 