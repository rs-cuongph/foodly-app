"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { ROUTES } from "@/shared/constants";
import CustomIcon from "@/components/atoms/CustomIcon";

export default function Sidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const [status, setStatus] = useState(false);
  const handleLoginLogout = () => {
    // TODO
  };

  const items = [
    {
      name: "Trang Chủ",
      icon: <CustomIcon name="home" />,
      key: 1,
      pathRegex: new RegExp(/^\/home+$/g),
      authenticate: false,
      onClick: () => {
        router.push(ROUTES.HOME);
      },
    },
    {
      name: "Thanh Toán",
      icon: <CustomIcon name="payment" />,
      key: 2,
      pathRegex: new RegExp(/^\/payment/g),
      authenticate: true,
      onClick: () => {
        router.push(ROUTES.PAYMENT);
      },
    },
    {
      name: "Nhóm Của Tôi",
      icon: <CustomIcon name="groups" />,
      key: 3,
      pathRegex: new RegExp(/^\/groups/g),
      authenticate: true,
      onClick: () => {
        router.push(ROUTES.GROUPS);
      },
    },
    {
      name: "Tôi",
      icon: <CustomIcon name="me" />,
      key: 4,
      pathRegex: new RegExp(/^\/my-page+$/g),
      authenticate: true,
      onClick: () => {
        router.push(ROUTES.MY_PAGE);
      },
    },
  ];

  const itemsFilter = useMemo(() => {
    return items;
  }, []);

  const checkIsActive = useCallback(
    (pathRegex: RegExp) => {
      if (pathRegex.test(pathName)) {
        return "bg-[#fe724c40] text-[#fe724c]";
      }

      return "";
    },
    [pathName],
  );

  return (
    <div className="rounded-2xl shadow-2xl shadow-blue-500/20 backdrop-blur-sm w-[280px] h-[600px] z-[9] ml-2.5 max-md:fixed max-md:h-20 max-md:w-full max-md:m-0 max-md:left-0 max-md:bottom-0 max-md:p-2.5 bg-white">
      <div className="relative flex gap-1 flex-col w-[280px] h-[600px] px-3 py-3 rounded-[15px]  max-md:w-full  max-md:flex-row  max-md:h-[60px]  max-md:pl-2.5  max-md:pr-[60px]  max-md:py-[5px] max-[400px]:justify-evenly">
        {itemsFilter.map((item) => {
          return (
            <div
              key={item.key}
              className={
                clsx(
                  `hover:text-[#fe724c] hover:bg-[#fe724c40] rounded-xl nav-item-element-${item.key}`,
                  checkIsActive(item.pathRegex),
                ) +
                " cursor-pointer flex items-center gap-3.5 text-sm px-2.5 py-[10px] max-md:gap-[5px] max-md:h-auto"
              }
              role="presentation"
              onClick={item.onClick}
            >
              {checkIsActive(item.pathRegex)}
              <div className="w-6 h-6">{item.icon}</div>
              <span className="text-sm text-ellipsis line-clamp-2 max-[400px]:hidden">
                {item.name}
              </span>
            </div>
          );
        })}
        <div
          className="cursor-pointer absolute bg-[#fe724c] flex flex-row items-center shadow-[0px_10px_30px_0px_rgba(254,114,76,0.2)] text-white px-3.5 py-2 rounded-[28.5px] left-5 bottom-[15px] max-md:left-[unset] max-md:right-2.5 max-md:bottom-3"
          role="presentation"
          onClick={handleLoginLogout}
        >
          {status === true ? (
            <div className="flex gap-1 items-center">
              <Icon className="h-5 w-5 text-white" icon="ph:power" />
              <span className="text-sm not-italic font-normal leading-[100%] max-md:hidden">
                Đăng Xuất
              </span>
            </div>
          ) : (
            <div className="flex gap-1 items-center ">
              <Icon
                className="h-5 w-5 text-white"
                icon="lucide:circle-arrow-out-down-right"
              />
              <span className="font-bold text-sm not-italic leading-[100%] max-md:hidden">
                Đăng Nhập
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
