import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';
import { APP_SITE_URL, PUBLIC_SITE_URL } from './utils/constants';

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale
});

function stripTrailingSlash(path: string) {
  return path !== '/' ? path.replace(/\/+$/, '') : '/';
}

const PUBLIC_HOSTNAME = new URL(PUBLIC_SITE_URL).hostname;
const APP_HOSTNAME = new URL(APP_SITE_URL).hostname;
const PUBLIC_CARD_PREFIXES = ['/profileDetails', '/p'];
const APP_ONLY_PREFIXES = ['/profile', '/admin', '/login', '/changePassword'];

function hasPrefixedPath(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function redirectTo(origin: string, pathname: string, search: string) {
  return NextResponse.redirect(`${origin}${pathname}${search}`, 308);
}

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Split & detect locale
  const [, firstSeg, ...rest] = pathname.split('/');
  const hasLocale = locales.includes(firstSeg as (typeof locales)[number]);
  const currentLocale = hasLocale ? firstSeg : undefined;

  // Normalize path without locale and trailing slash
  const pathWithoutLocale = stripTrailingSlash(hasLocale ? `/${rest.join('/')}` : pathname);
  const hostname =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname;

  if (
    hostname === APP_HOSTNAME &&
    PUBLIC_HOSTNAME !== APP_HOSTNAME &&
    hasPrefixedPath(pathWithoutLocale, PUBLIC_CARD_PREFIXES)
  ) {
    return redirectTo(PUBLIC_SITE_URL, pathname, search);
  }

  if (
    hostname === PUBLIC_HOSTNAME &&
    PUBLIC_HOSTNAME !== APP_HOSTNAME &&
    hasPrefixedPath(pathWithoutLocale, APP_ONLY_PREFIXES)
  ) {
    return redirectTo(APP_SITE_URL, pathname, search);
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
