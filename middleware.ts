import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect locale-prefixed handler routes to non-locale handler routes
  // e.g., /en/handler/sign-in -> /handler/sign-in
  const localeMatch = pathname.match(/^\/(en|kurdish|ar)\/handler\/(.+)$/);
  if (localeMatch) {
    const [, , handlerPath] = localeMatch;
    const redirectUrl = new URL(`/handler/${handlerPath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Skip locale routing for handler routes (Stack Auth)
  if (pathname.startsWith('/handler')) {
    return NextResponse.next();
  }

  // Handle admin routes - check session before locale routing
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const hasAdminSession = request.cookies.get('admin-session')?.value === 'true';
    if (!hasAdminSession) {
      // Preserve locale in redirect if present
      const locale = pathname.split('/')[1];
      const isLocale = ['en', 'kurdish', 'ar'].includes(locale);
      const adminPath = isLocale ? `/${locale}/admin/login` : '/admin/login';
      return NextResponse.redirect(new URL(adminPath, request.url));
    }
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
