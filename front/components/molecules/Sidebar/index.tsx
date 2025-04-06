'use client';

import { Button, User } from '@heroui/react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { siteConfig } from '@/config/site';

export function Sidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const session = useSession();
  const t = useTranslations('button');

  const menuItems = [
    // {
    //   name: 'Home',
    //   icon: <HomeIcon />,
    //   pathRegex: new RegExp(/^\/home+$/g),
    //   requiredAuth: false,
    //   onClick: () => {
    //     router.push(siteConfig.routes.home);
    //   },
    // },
    // {
    //   name: 'History Order',
    //   icon: <HistoryOrderIcon />,
    //   pathRegex: new RegExp(/^\/history-order+$/g),
    //   requiredAuth: true,
    //   onClick: () => {
    //     router.push(siteConfig.routes.history);
    //   },
    // },
    // {
    //   name: 'My Group',
    //   icon: <GroupIcon />,
    //   pathRegex: new RegExp(/^\/my-group+$/g),
    //   requiredAuth: true,
    //   onClick: () => {
    //     router.push(siteConfig.routes.my_group);
    //   },
    // },
  ];

  const isLogin = useMemo(() => {
    return session.status === 'authenticated';
  }, [session.status]);

  const MenuItemFiltered = useMemo(() => {
    return menuItems.filter((item) => {
      if (isLogin) return true;

      return (item.requiredAuth = false);
    });
  }, [isLogin, menuItems]);

  const handleSignInOrSignOUt = () => {
    if (isLogin) signOut();
    router.push(siteConfig.routes.login);
  };

  const checkIsActive = useCallback(
    (pathRegex: RegExp) => {
      if (pathRegex.test(pathName)) {
        return 'bg-[#fe724c40] text-[#fe724c]';
      }

      return '';
    },
    [pathName],
  );

  const openSignInModal = () => {
    // setIsOpenSignInModal(true);
  };

  return (
    <div className="min-w-[300px] flex flex-col gap-2">
      <div className="w-full bg-white rounded-t-lg px-6 py-4 flex justify-center">
        {isLogin ? (
          <User
            avatarProps={{
              src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
            }}
            description="Product Designer"
            name="Jane Doe"
          />
        ) : (
          <Button className="w-full" color="primary" onClick={openSignInModal}>
            {t('login').toUpperCase()}
          </Button>
        )}
      </div>
      <div className="w-full h-[250px] bg-white rounded-b-3xl">
        <div className="flex flex-row flex-1 justify-around sm:justify-start sm:flex-auto gap-2">
          {MenuItemFiltered.map((item, index) => (
            <div
              key={index}
              className={clsx(
                'cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-4 py-2.5 max-md:gap-[5px] max-md:h-auto text-black',
                `hover:text-[#fe724c] hover:bg-[#fe724c40] rounded-xl nav-item-element-${index} [&_span]:hover:block`,
                checkIsActive(item.pathRegex),
              )}
              role="presentation"
              onClick={item.onClick}
            >
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-sm text-ellipsis line-clamp-2 max-sm:hidden">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
