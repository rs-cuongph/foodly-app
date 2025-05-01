import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Providers } from '../../providers/hero-ui';

import Header from '@/components/molecules/header';
import Sidebar from '@/components/molecules/sidebar';
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

// Static settings to tell Next.js to cache this component and prevent re-renders
export const dynamic = 'force-static';
export const revalidate = false;

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

  const messages = await getMessages({ locale });

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthProvider>
            <ReactQueryProvider>
              <Providers
                themeProps={{ attribute: 'class', defaultTheme: 'light' }}
              >
                <div className="w-screen h-screen relative overflow-x-hidden flex flex-col bg-center bg-cover bg-banner bg-no-repeat">
                  <Header />
                  <main className="w-full mx-auto pt-4 md:px-8 px-4 md:flex md:gap-4 lg:gap-10">
                    <Sidebar />
                    <div className="w-full h-full">{children}</div>
                  </main>
                  <div className="h-16 w-full md:h-4" />
                </div>
                <SignInUpModal />
                <UpsertGroupModal />
                <ConfirmModal />
                <OrderModal />
              </Providers>
            </ReactQueryProvider>
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
