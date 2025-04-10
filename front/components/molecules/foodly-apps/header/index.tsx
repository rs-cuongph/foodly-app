'use client';

import { LanguageIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import { setCookie } from 'cookies-next';
import { useLocale } from 'next-intl';
import Image from 'next/image';

import { usePathname, useRouter } from '@/i18n/navigation';
export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Toggle locale
  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'vi' : 'en';

    // Set cookie to remember user preference
    setCookie('NEXT_LOCALE', newLocale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });

    // Navigate to new locale
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div
      className={clsx(
        'w-full absolute top-[10px] right-[50%] transform translate-x-1/2 flex flex-row header-wrapper mx-auto justify-between md:px-8 px-4',
      )}
    >
      <div className="flex flex-row items-center gap-2 backdrop:blur-md px-2 py-1 backdrop-blur-md bg-[#fe724c91] rounded-[30px]">
        <Image
          alt="foodly booking"
          className="rounded-[30px]"
          height={40}
          src={'/images/logo.webp'}
          width={40}
        />
        <span className="font-bold text-[18px] text-white">FOODLY BOOKING</span>
      </div>

      <div className="flex flex-row items-center gap-2 bg-white rounded-[16px] px-1">
        <Button isIconOnly color="primary" size="md" onPress={toggleLocale}>
          <LanguageIcon className="h-6 w-6 text-white" />
        </Button>
        <span className="text-sm text-gray-500 pr-2">
          {locale.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
