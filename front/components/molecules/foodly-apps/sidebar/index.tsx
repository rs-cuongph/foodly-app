'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from '@heroui/react';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { MyButton } from '@/components/atoms/Button';
import {
  DocumentIcon,
  LoginIcon,
  LogoutIcon,
  MyGroupIcon,
  SettingIcon,
} from '@/components/atoms/icons';
import { siteConfig } from '@/config/site';
import { useGetUserInfoQuery } from '@/hooks/api/auth';
import { useSystemToast } from '@/hooks/toast';
import { useWebAuthClient } from '@/hooks/web-authn';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

export function Sidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations('button');
  const commonStore = useCommonStore();
  const { data: session, status } = useSession();
  const { setUserInfo, setIsLoggedIn } = useAuthStore();
  const { showSuccess } = useSystemToast();
  const {
    createRegistration,
    getChallenge,
    verifyRegistration,
    createAuthentication,
    verifyAuthentication,
  } = useWebAuthClient();

  const { data: userInfo } = useGetUserInfoQuery(
    session?.user?.id || '',
    session?.user?.access_token || '',
  );

  const menuItems = [
    {
      name: t('home'),
      icon: <HomeIcon className="w-7 h-7 text-primary" />,
      pathRegex: '/[a-z]{2}/foodly+',
      requiredAuth: false,
      onClick: () => {
        router.push(siteConfig.apps.foodly.routes.home);
      },
    },
    {
      name: t('payment_history'),
      icon: <DocumentIcon className="w-7 h-7 text-primary" />,
      pathRegex: '/[a-z]{2}/foodly/history-order',
      requiredAuth: true,
      onClick: () => {
        router.push(siteConfig.apps.foodly.routes.history);
      },
    },
    {
      name: t('my_group'),
      icon: <MyGroupIcon className="w-7 h-7 text-primary" />,
      pathRegex: '/[a-z]{2}/foodly/my-group',
      requiredAuth: true,
      onClick: () => {
        router.push(siteConfig.apps.foodly.routes.my_group);
      },
    },
    {
      name: t('my_page'),
      icon: <SettingIcon className="w-7 h-7 text-primary" />,
      pathRegex: '/[a-z]{2}/foodly/my-page',
      requiredAuth: true,
      onClick: () => {
        router.push(siteConfig.apps.foodly.routes.my_page);
      },
    },
  ];

  const isLogin = useMemo(() => {
    const isLoggedIn = Boolean(status === 'authenticated' && userInfo);

    return isLoggedIn;
  }, [status, userInfo]);

  const MenuItemFiltered = useMemo(() => {
    return menuItems.filter((item) => {
      if (isLogin) return true;

      return (item.requiredAuth = false);
    });
  }, [isLogin, menuItems]);

  const checkIsActive = (pathRegex: string) => {
    const regex = new RegExp(pathRegex, 'i');

    if (regex.test(pathName)) {
      return true;
    }

    return false;
  };

  const openSignInModal = () => {
    commonStore.setIsOpen(true, ModalType.AUTH, FormType.SIGN_IN);
  };

  const handleSignOut = () => {
    signOut({ redirect: false });
    router.push(siteConfig.apps.foodly.routes.home);
  };

  const handleRegisterWebAuthn = async () => {
    if (!userInfo) return;
    try {
      const challenge = await getChallenge();

      const registration = await createRegistration({
        user: {
          id: userInfo.id,
          name: userInfo.email,
        },
        challenge,
      });

      await verifyRegistration(challenge, registration);
      showSuccess('Register WebAuthn success');
    } catch (error) {
      console.log(error);
    } finally {
      //
    }
  };

  const handleSignInWebAuthn = async () => {
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
    } finally {
      //
    }
  };

  useEffect(() => {
    if (userInfo) {
      setUserInfo(userInfo);
    }
  }, [setUserInfo, userInfo]);

  useEffect(() => {
    setIsLoggedIn(isLogin);
  }, [isLogin]);

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
                <User
                  avatarProps={{
                    src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
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
                        <span className="cursor-help">{userInfo?.email}</span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-bold">
                            {userInfo?.email}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  }
                  name={
                    <Popover placement="bottom" showArrow={true}>
                      <PopoverTrigger>
                        <span className="cursor-help">
                          {userInfo?.display_name}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="px-1 py-2">
                          <div className="text-small font-bold">
                            {userInfo?.display_name}
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
                {t('login').toUpperCase()}
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
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:hidden bg-white rounded-full px-2 py-2 absolute bottom-4 w-[calc(100%-2rem)] mx-auto left-0 right-0">
        <div className="flex gap-2 items-center justify-between">
          <div>
            {isLogin ? (
              <div className="flex gap-2 items-center">
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <div className="hidden sm:flex flex-col gap-0">
                  <span className="text-sm text-ellipsis line-clamp-1 max-w-[100px] sm:max-w-[200px]">
                    {userInfo?.display_name}
                  </span>
                  <span className="text-tiny text-ellipsis line-clamp-1 text-foreground-400 max-w-[100px] sm:max-w-[200px]">
                    {userInfo?.email}
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
                    'cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-2 py-1 max-md:gap-[5px] max-md:h-auto',
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
