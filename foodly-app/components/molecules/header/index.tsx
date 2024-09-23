"use client";

import clsx from "clsx";
import Image from "next/image";
import logo from "@/public/images/logo.webp";
import { Avatar } from "@nextui-org/react";

export default function Header() {
  return (
    <div
      className={clsx(
        "w-full max-w-7xl absolute top-[10px] right-[50%] transform translate-x-1/2 flex flex-row pl-4 pr-4 header-wrapper  mx-auto justify-between"
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

      <div className="flex flex-row items-center gap-3 ">
        <h3 className="m-0 text-white font-bold text-[14px] hidden sm:block">
          abc@gmail.com
        </h3>
        <Avatar
          isBordered
          color="primary"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        />
      </div>
    </div>
  );
}
