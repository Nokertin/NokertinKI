import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }
  if (pathname === '/login') return NextResponse.next();

  const auth = req.cookies.get('auth');
  if (auth && auth === '1') return NextResponse.next();

  return NextResponse.redirect(new URL('/login', req.url));
}
