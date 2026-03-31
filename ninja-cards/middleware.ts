import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuthShared';

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale
});

function stripTrailingSlash(path: string) {
  return path !== '/' ? path.replace(/\/+$/, '') : '/';
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Split & detect locale
  const [, firstSeg, ...rest] = pathname.split('/');
  const hasLocale = locales.includes(firstSeg as (typeof locales)[number]);
  const currentLocale = hasLocale ? firstSeg : undefined;

  // Normalize path without locale and trailing slash
  const pathWithoutLocale = stripTrailingSlash(hasLocale ? `/${rest.join('/')}` : pathname);

  if (pathWithoutLocale.startsWith('/admin') && pathWithoutLocale !== '/admin/login') {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminToken) {
      const targetLocale = currentLocale ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${targetLocale}/admin/login`, request.url));
    }
  }

  // Protect *only* /profile (not /profileDetails/*)
  // if (pathWithoutLocale === '/profile') {
  //   const token = request.cookies.get('token')?.value;

  //   console.log('Auth token:', token);

  //   if (!token) {
  //     const targetLocale = currentLocale ?? defaultLocale;

  //     return NextResponse.redirect(new URL(`/${targetLocale}`, request.url));
  //   }
  // }

  // Everything else goes through next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(bg|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};
