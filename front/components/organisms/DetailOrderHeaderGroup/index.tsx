"use client";

import CustomIcon from "@/components/atoms/CustomIcon";
import { Tag } from "@/components/atoms/Tag";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import { DETAIL_ORDER_DROPDOWN_ITEMS  } from "@/shared/constants";

export default function DetailOrderHeaderGroup() {
  const tags = [
    {
      label: "000000001",
      icon: "hashtag",
    },
    {
      label: "10",
      icon: "peoples",
    },
    {
      label: "00:30:00",
      icon: "alarm-clock",
    },
    {
      label: "25,000",
      icon: "dollar-circle",
    },
  ];

  return (
    <div className="max-h-[167px] grid w-full h-[167px] grid-cols-12 gap-[15px]">
      <div className="bg-image-default w-full col-span-12 md:col-span-3 rounded-xl h-full">
        <Image
          alt="Default Image"
          src="/images/image_default.webp"
          className="object-cover h-full w-full"
          classNames={{
            wrapper: "h-full md:max-w-fit !max-w-full",
          }}
        />
      </div>
      <div className="bg-white col-span-12 md:col-span-9 rounded-xl p-[13px]">
        <div className="flex justify-between md:items-center">
          <div className="flex md:items-center gap-2">
            <CustomIcon name="clip-path-group" className="mt-1 md:mt-0"/>
            <div className="flex items-center gap-1 flex-wrap md:flex-nowrap">
              {tags.map((item, index) => (
                <Tag key={index} label={item.label} icon={item.icon}/>
              ))}
            </div>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly >
                <CustomIcon name="dots" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {DETAIL_ORDER_DROPDOWN_ITEMS.map((item, index) => (
                <DropdownItem key={index} href="#">
                  <span className="flex items-center gap-2">
                    <CustomIcon name={item.icon} />
                    {item.label}
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="mt-[10px]">
          <h1 className="text-base font-bold">Group Name</h1>
          <ul className="text-xs font-medium list-disc pl-6 text-coral-orange mt-1">
            <li>Cơm chay</li>
            <li>Cơm chay 2</li>
          </ul>
        </div>
        <div className="md:flex justify-end gap-2 hidden">
          <Button variant="bordered" className="border-coral-orange text-coral-orange" startContent={<CustomIcon name="chat" />}>
            Chat
          </Button>
          <Button className="bg-coral-orange text-white" startContent={<CustomIcon name="cart" />}>
            Đặt đơn
          </Button>
        </div>
        <div className="flex justify-center md:mt-0 mt-6">
          <div className="flex items-center text-translucent-black text-xs font-medium gap-1 cursor-pointer">
            Xem thêm 
            <CustomIcon name="caret-down" />
          </div>
        </div>
      </div>
    </div>
  );
}
