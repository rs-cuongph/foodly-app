"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import {
  GroupIcon,
  HistoryOrderIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
} from "@/components/atoms/icons";

export function BottomMenu() {
  const router = useRouter();
  const pathName = usePathname();
  const session = useSession()

  const menuItems = [
    {
      name: "Home",
      icon: <HomeIcon />,
      pathRegex: new RegExp(/^\/home+$/g),
      requiredAuth: false,
      onClick: () => {
        router.push(siteConfig.routes.home);
      },
    },
    {
      name: "History Order",
      icon: <HistoryOrderIcon />,
      pathRegex: new RegExp(/^\/history-order+$/g),
      requiredAuth: true,
      onClick: () => {
        router.push(siteConfig.routes.history);
      },
    },
    {
      name: "My Group",
      icon: <GroupIcon />,
      pathRegex: new RegExp(/^\/my-group+$/g),
      requiredAuth: true,
      onClick: () => {
        router.push(siteConfig.routes.my_group);
      },
    },
  ];

  const isLogin = useMemo(() => {
    return session.status === 'authenticated'
  }, [session.status]);


  const MenuItemFiltered = useMemo(() => {
    return menuItems.filter((item) => {
      if (isLogin) return true;

      return (item.requiredAuth = false);
    });
  }, [isLogin, menuItems]);

  const handleSignInOrSignOUt = () => {
    if (isLogin) signOut()
    router.push(siteConfig.routes.login)
  }

  const checkIsActive = useCallback(
    (pathRegex: RegExp) => {
      if (pathRegex.test(pathName)) {
        return "bg-[#fe724c40] text-[#fe724c]";
      }

      return "";
    },
    [pathName]
  );

  return (
    <div className="bg-white max-w-[700px] w-[calc(100%_-_16px)] fixed bottom-5 flex flex-row justify-between px-x py-2 sm:px-4 sm:py-3 rounded-3xl gap-5 left-[50%] translate-x-[-50%]">
      <div className="flex flex-row flex-1 justify-around sm:justify-start sm:flex-auto gap-2">
        {MenuItemFiltered.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-4 py-2.5 max-md:gap-[5px] max-md:h-auto text-black",
              `hover:text-[#fe724c] hover:bg-[#fe724c40] rounded-xl nav-item-element-${index} [&_span]:hover:block`,
              checkIsActive(item.pathRegex)
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
      <div>
        <div className="cursor-pointer flex items-center gap-1 md:gap-2 text-sm px-4 py-2.5 max-md:h-auto hover:bg-[#fe724c40] rounded-xl hover:text-[#fe724c]" onClick={handleSignInOrSignOUt}>
          <div className="bg-primary px-2 py-2 rounded-md">
            {isLogin ? <LogoutIcon /> : <LoginIcon />}
          </div>

          <span className="text-sm text-ellipsis line-clamp-2 max-sm:hidden text-black">
            {isLogin ? "Logout" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}
