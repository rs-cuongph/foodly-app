import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  localeDetection: true,
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',
  localeCookie: {
    // Custom cookie name
    name: 'NEXT_LOCALE',
    // Expire in one year
    maxAge: 60 * 60 * 24 * 365,
  },
});
