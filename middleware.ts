import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle admin routes - other routes are handled by Stack Auth and server components
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const hasAdminSession = request.cookies.get('admin-session')?.value === 'true';
    if (!hasAdminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
