"use client";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";
import clsx from "clsx";

import logo from "@/public/images/logo.webp";
import { useWindowSize } from "@/hooks/window-size";

export default function Header() {
  const { isMobile } = useWindowSize();

  return (
    <div
      className={clsx(
        "absolute top-[10px] right-[50%] transform translate-x-1/2 flex flex-row w-full pl-4 pr-4 header-wrapper max-w-[1440px] mx-auto ",
        isMobile ? "justify-center" : "justify-between",
      )}
    >
      <div className="flex flex-row items-center gap-2 backdrop:blur-md px-2 py-1 backdrop-blur-md bg-[#fe724c91] rounded-[30px]">
        <Image
          alt="foodly booking"
          className="rounded-[30px]"
          height={40}
          src={logo.src}
          width={40}
        />
        <span className="font-bold text-[18px] text-white">FOODLY BOOKING</span>
      </div>

      <div className="flex flex-row  items-center gap-3 ">
        {!isMobile && (
          <h3 className="m-0 text-white font-bold text-[14px]">
            abc@gmail.com
          </h3>
        )}
        <Avatar
          isBordered
          color="primary"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        />
      </div>
    </div>
  );
}
