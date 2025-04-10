'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

import SplashScreen from '@/components/molecules/loading-screen';

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const { status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: 'always',
            gcTime: 0,
            retry: false,
          },
        },
      }),
    [],
  );

  useEffect(() => {
    if (status !== 'loading') setIsLoaded(true);
  }, [status]);

  if (status === 'loading' && !isLoaded) {
    return <SplashScreen />;
  }

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
