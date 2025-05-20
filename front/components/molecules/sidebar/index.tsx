'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

import { MyButton } from '@/components/atoms/Button';
import {
  DocumentIcon,
  LoginIcon,
  LogoutIcon,
  MyGroupIcon,
  SettingIcon,
} from '@/components/atoms/icons';
import UserAvatar from '@/components/atoms/UserAvatar';
import { STORAGE_KEYS } from '@/config/constant';
import { siteConfig } from '@/config/site';
import { useGetUserInfoQuery } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { useWebAuthClient } from '@/hooks/web-authn';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

export default function Sidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const commonStore = useCommonStore();
  const { data: session, status } = useSession();
  const {
    setUserInfo,
    setIsLoggedIn,
    userInfo: storeUserInfo,
  } = useAuthStore();
  const { showSuccess } = useSystemToast();
  const {
    createRegistration,
    getChallenge,
    verifyRegistration,
    createAuthentication,
    verifyAuthentication,
  } = useWebAuthClient();

  const pathNameWithoutLocale = pathName.replace(`/${locale}`, '');

  const { data: userInfoFromQuery } = useGetUserInfoQuery(
    session?.user?.id || '',
    session?.user?.access_token || '',
    pathNameWithoutLocale,
  );

  // Prioritize store user info to prevent undefined during navigation
  const currentUserInfo = useMemo(() => {
    return userInfoFromQuery || storeUserInfo;
  }, [userInfoFromQuery, storeUserInfo]);

  const countInitOrder = useMemo(() => {
    return currentUserInfo?.count_init_order || 0;
  }, [currentUserInfo]);

  const countProcessingOrder = useMemo(() => {
    return currentUserInfo?.count_processing_order || 0;
  }, [currentUserInfo]);

  const menuItems = useMemo(
    () => [
      {
        name: t('button.home'),
        icon: <HomeIcon className="w-7 h-7 text-primary" />,
        pathRegex: '/[a-z]{2}/?$',
        requiredAuth: false,
        onClick: () => {
          router.push(siteConfig.apps.routes.home);
        },
      },
      {
        name: t('button.payment_history'),
        icon: <DocumentIcon className="w-7 h-7 text-primary" />,
        pathRegex: '/[a-z]{2}/my-order',
        requiredAuth: true,
        countRender: () => {
          let color = 'default';
          let count: number | string = 0;

          if (countInitOrder <= 0 && countProcessingOrder <= 0) return <></>;

          if (countInitOrder > 0) {
            color = 'danger';
            count = countInitOrder;
          }

          if (!countInitOrder && countProcessingOrder > 0) {
            color = 'warning';
            count = countProcessingOrder;
          }

          if (count > 99) count = '99+';

          return (
            <Chip color={color as any} size="sm">
              {count}
            </Chip>
          );
        },
        onClick: () => {
          router.push(siteConfig.apps.routes.history);
        },
      },
      {
        name: t('button.my_group'),
        icon: <MyGroupIcon className="w-7 h-7 text-primary" />,
        pathRegex: '/[a-z]{2}/my-group',
        requiredAuth: true,

        onClick: () => {
          router.push(siteConfig.apps.routes.my_group);
        },
      },
      {
        name: t('button.my_page'),
        icon: <SettingIcon className="w-7 h-7 text-primary" />,
        pathRegex: '/[a-z]{2}/my-page',
        requiredAuth: true,
        onClick: () => {
          router.push(siteConfig.apps.routes.my_page);
        },
      },
    ],
    [t, router, countInitOrder, countProcessingOrder],
  );

  const isLogin = useMemo(() => {
    return Boolean(status === 'authenticated' && currentUserInfo);
  }, [status, currentUserInfo]);

  const MenuItemFiltered = useMemo(() => {
    return menuItems.filter((item) => {
      if (isLogin) return true;

      return !item.requiredAuth;
    });
  }, [isLogin, menuItems]);

  const checkIsActive = useCallback(
    (pathRegex: string) => {
      const regex = new RegExp(pathRegex, 'i');

      return regex.test(pathName);
    },
    [pathName],
  );

  const openSignInModal = useCallback(() => {
    commonStore.setIsOpen(true, ModalType.AUTH, FormType.SIGN_IN);
  }, [commonStore]);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    signOut({ redirect: false });
    Object.values(ModalType).forEach((modalType) => {
      commonStore.setIsOpen(false, modalType);
    });
    router.push(siteConfig.apps.routes.home);
  }, [commonStore, router]);

  const handleRegisterWebAuthn = useCallback(async () => {
    if (!currentUserInfo) return;
    try {
      const challenge = await getChallenge();

      const registration = await createRegistration({
        user: {
          id: currentUserInfo.id,
          name: currentUserInfo.email,
        },
        challenge,
      });

      await verifyRegistration(challenge, registration);
      showSuccess('Register WebAuthn success');
    } catch (error) {
      console.log(error);
    }
  }, [
    currentUserInfo,
    getChallenge,
    createRegistration,
    verifyRegistration,
    showSuccess,
  ]);

  const handleSignInWebAuthn = useCallback(async () => {
    try {
      const challenge = await getChallenge();

      const authentication = await createAuthentication({
        timeout: 60000,
        challenge,
        userVerification: 'required',
      });

      await verifyAuthentication(challenge, authentication);
      showSuccess('Sign in WebAuthn success');
    } catch (error) {
      console.log(error);
    }
  }, [getChallenge, createAuthentication, verifyAuthentication, showSuccess]);

  // Only update store when we have valid userInfo from query
  useEffect(() => {
    if (userInfoFromQuery) {
      setUserInfo(userInfoFromQuery);
    }
  }, [userInfoFromQuery, setUserInfo]);

  useEffect(() => {
    setIsLoggedIn(isLogin);
  }, [isLogin, setIsLoggedIn]);

  useEffect(() => {
    // add event listener
    window.addEventListener('forceLogin', handleSignOut);

    return () => {
      // remove event listener
      window.removeEventListener('forceLogin', handleSignOut);
    };
  }, [handleSignOut]);

  return (
    <>
      <div className="min-w-[300px] flex-col gap-2 hidden md:flex">
        <div
          className={clsx(
            'w-full bg-white rounded-t-lg px-6 py-4 flex',
            isLogin ? 'justify-start' : 'justify-center',
          )}
        >
          {isLogin ? (
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row items-center gap-2 justify-between w-full flex-1">
                <UserAvatar
                  avatarProps={{
                    classNames: {
                      base: 'min-w-[40px] min-h-[40px]',
                    },
                  }}
                  classNames={{
                    description:
                      'text-ellipsis line-clamp-1 break-words break-all',
                    name: 'text-ellipsis line-clamp-1 break-words break-all',
                  }}
                  description={
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <span className="cursor-help">
                          {currentUserInfo?.email}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-bold">
                            {currentUserInfo?.email}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  }
                  id={currentUserInfo?.email}
                  name={
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <span className="cursor-help">
                          {currentUserInfo?.display_name}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-bold">
                            {currentUserInfo?.display_name}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  }
                />
                <MyButton
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={handleSignOut}
                >
                  <LogoutIcon className="w-6 h-6 text-primary" />
                </MyButton>
              </div>
              {/* <MyButton
                className="w-full"
                color="primary"
                onPress={handleRegisterWebAuthn}
              >
                Register WebAuthn
              </MyButton> */}
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <MyButton
                className="w-full"
                color="primary"
                onPress={openSignInModal}
              >
                <LoginIcon className="w-6 h-6 text-white" />
                {t('button.login').toUpperCase()}
              </MyButton>
              {/* <MyButton
                className="w-full"
                color="primary"
                onPress={handleSignInWebAuthn}
              >
                Authenticate WebAuthn
              </MyButton> */}
            </div>
          )}
        </div>
        <div className="w-full h-[250px] bg-white rounded-b-3xl">
          <div className="flex flex-col flex-1 justify-around">
            {MenuItemFiltered.map((item, index) => (
              <div
                key={index}
                className={clsx(
                  'cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-4 py-2.5 max-md:gap-[5px] max-md:h-auto text-black',
                  `hover:text-[#fe724c] hover:bg-[#fe724c40] nav-item-element-${index} [&_span]:hover:block`,
                  checkIsActive(item.pathRegex) &&
                    'bg-primary-50 text-primary font-bold',
                )}
                onClick={item.onClick}
              >
                <div>{item.icon}</div>
                <span className="text-sm text-ellipsis line-clamp-2 max-sm:hidden">
                  {item.name}
                </span>
                {item.countRender && item.countRender()}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:hidden bg-white rounded-full px-2 py-2 fixed bottom-2 w-[calc(100%-2rem)] mx-auto left-0 right-0 drop-shadow-xl z-50 border border-primary-50">
        <div className="flex gap-2 items-center justify-between">
          <div>
            {isLogin ? (
              <div className="flex gap-2 items-center">
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <div className="hidden sm:flex flex-col gap-0">
                  <span className="text-sm text-ellipsis line-clamp-1 max-w-[100px] sm:max-w-[200px]">
                    {currentUserInfo?.display_name}
                  </span>
                  <span className="text-tiny text-ellipsis line-clamp-1 text-foreground-400 max-w-[100px] sm:max-w-[200px]">
                    {currentUserInfo?.email}
                  </span>
                </div>
              </div>
            ) : (
              <MyButton
                isIconOnly
                color="primary"
                variant="flat"
                onPress={openSignInModal}
              >
                <LoginIcon className="w-6 h-6 text-white" />
              </MyButton>
            )}
          </div>
          <div className="flex flex-row items-center">
            {MenuItemFiltered.map((item, index) => {
              const isActive = checkIsActive(item.pathRegex);

              return (
                <div
                  key={index}
                  className={clsx(
                    'relative cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-2 py-1 max-md:gap-[5px] max-md:h-auto',
                    isActive
                      ? 'bg-primary-50 text-primary font-bold'
                      : 'text-black',
                  )}
                  onClick={item.onClick}
                >
                  <div>{item.icon}</div>
                  <span
                    className={clsx(
                      'text-sm text-ellipsis line-clamp-2 hidden',
                      isActive && '!block',
                    )}
                  >
                    {item.name}
                  </span>
                  {item.countRender && item.countRender()}
                </div>
              );
            })}
            {isLogin && (
              <MyButton
                isIconOnly
                className="rounded-full"
                color="primary"
                variant="flat"
                onPress={handleSignOut}
              >
                <LogoutIcon className="w-6 h-6 text-primary" />
              </MyButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
