import type { NextRequest } from 'next/server';

import createMiddleware from 'next-intl/middleware';

import { authMiddleware, chainMiddlewares } from './config/middleware';
import { routing } from './i18n/routing';

// Create the i18n middleware
const i18nMiddleware = createMiddleware(routing);

// Export the combined middleware
export default async function middleware(request: NextRequest) {
  // Get the pathname from the request

  return chainMiddlewares([i18nMiddleware, authMiddleware])(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
