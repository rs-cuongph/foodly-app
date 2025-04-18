import { Metadata, Viewport } from 'next';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import Header from '@/components/molecules/foodly-apps/header';
import { Sidebar } from '@/components/molecules/foodly-apps/sidebar';
import SignInUpModal from '@/components/organisms/foodly-apps/auth-modal';
import ConfirmModal from '@/components/organisms/foodly-apps/confirm-modal';
import OrderModal from '@/components/organisms/foodly-apps/order-modal';
import UpsertGroupModal from '@/components/organisms/foodly-apps/upsert-group-modal';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: {
    default: siteConfig.apps.foodly.title,
    template: `%s - ${siteConfig.apps.foodly.title}`,
  },
  description: siteConfig.apps.foodly.description,
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export const viewport: Viewport = {
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
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <>
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
    </>
  );
}
