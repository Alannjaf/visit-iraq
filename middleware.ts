import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect locale-prefixed handler routes to non-locale handler routes
  // e.g., /en/handler/sign-in -> /handler/sign-in
  const handlerLocaleMatch = pathname.match(/^\/(en|kurdish|ar)\/handler\/(.+)$/);
  if (handlerLocaleMatch) {
    const [, , handlerPath] = handlerLocaleMatch;
    const redirectUrl = new URL(`/handler/${handlerPath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect locale-prefixed admin routes to non-locale admin routes
  // e.g., /en/admin/login -> /admin/login
  const adminLocaleMatch = pathname.match(/^\/(en|kurdish|ar)\/admin\/(.+)$/);
  if (adminLocaleMatch) {
    const [, , adminPath] = adminLocaleMatch;
    const redirectUrl = new URL(`/admin/${adminPath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Skip locale routing for handler routes (Stack Auth)
  if (pathname.startsWith('/handler')) {
    return NextResponse.next();
  }

  // Skip locale routing for admin routes (admin panel should not be localized)
  if (pathname.startsWith('/admin')) {
    // Check admin session for protected admin routes
    if (!pathname.startsWith('/admin/login')) {
      const hasAdminSession = request.cookies.get('admin-session')?.value === 'true';
      if (!hasAdminSession) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
    return NextResponse.next();
  }

  // Apply next-intl middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel` or `/.netlify`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // Note: handler routes are handled separately in middleware
  matcher: ['/((?!api|_next|_vercel|\\.netlify|.*\\..*).*)'],
};
