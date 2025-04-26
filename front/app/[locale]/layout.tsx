import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

import { Providers } from '../../providers/hero-ui';

import Header from '@/components/molecules/header';
import { Sidebar } from '@/components/molecules/sidebar';
import SignInUpModal from '@/components/organisms/auth-modal';
import ConfirmModal from '@/components/organisms/confirm-modal';
import OrderModal from '@/components/organisms/order-modal';
import UpsertGroupModal from '@/components/organisms/upsert-group-modal';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { NextAuthProvider } from '@/providers/next-auth';
import { ReactQueryProvider } from '@/providers/react-query';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;

  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextAuthProvider>
          <ReactQueryProvider>
            <Providers
              themeProps={{ attribute: 'class', defaultTheme: 'light' }}
            >
              <NextIntlClientProvider locale={locale} messages={messages}>
                <div className="relative flex flex-col h-screen overflow-y-hidden bg-center bg-cover bg-banner bg-no-repeat">
                  <Header />
                  <main className="w-full mx-auto pt-16 md:pt-[135px] md:px-8 px-4 md:flex md:gap-4 lg:gap-10">
                    <Sidebar />
                    <div className="w-full h-full min-h-screen md:mt-0 mt-[85px] overflow-auto overflow-x-hidden">
                      {children}
                    </div>
                  </main>
                </div>
                <SignInUpModal />
                <UpsertGroupModal />
                <ConfirmModal />
                <OrderModal />
              </NextIntlClientProvider>
            </Providers>
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
