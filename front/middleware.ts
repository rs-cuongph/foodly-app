import type { NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { authMiddleware, chainMiddlewares } from './config/middleware';
import { routing } from './i18n/routing';

// Create the i18n middleware
const i18nMiddleware = createMiddleware(routing);

// Export the combined middleware
export default async function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;
  const lang = pathname.split('/')[1] || 'en';
  const app = pathname.split('/')[2] || 'foodly';

  // If the pathname is the root path, redirect to the default URL
  if (pathname === '/en' || pathname === '/vi' || pathname === '/') {
    // You can change this to your desired default path
    // For example: '/en/dashboard' or '/en/home'
    return NextResponse.redirect(new URL(`/${lang}/${app}`, request.url));
  }

  return chainMiddlewares([authMiddleware, i18nMiddleware])(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
