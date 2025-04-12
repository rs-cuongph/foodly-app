"use client";

import type { ThemeProviderProps } from "next-themes";

import { ToastProvider } from '@heroui/react';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

import { useWindowSize } from '@/hooks/window-size';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const { locale } = useParams();

  const toastPlacement = isMobile ? 'top-center' : 'bottom-right';

  return (
    <HeroUIProvider locale={locale as string} navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider placement={toastPlacement} />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
