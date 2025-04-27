import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';

import { FoodLoading } from '@/components/atoms/FoodLoading';

export default function SplashScreen() {
  const t = useTranslations();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="relative">
          <Spinner className="animate-spin" color="warning" size="lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FoodLoading />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold text-warning-500 animate-pulse">
            {t('loading_screen.loading')}
          </p>
          <p className="text-sm text-default-500">
            {t('loading_screen.please_wait')}
          </p>
        </div>
      </div>
    </div>
  );
}
