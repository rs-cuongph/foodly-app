'use client';

import { LanguageIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { usePathname, useRouter } from '@/i18n/navigation';

export default function Header() {
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // Toggle locale
  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'vi' : 'en';

    // Navigate to new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className={clsx(
        'py-2 md:px-8 px-4 sticky top-0 z-50',
        'w-full flex flex-row header-wrapper mx-auto justify-between',
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
