"use client";

import { Button, Input, Selection } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import ModalCreateRoom from "../ModalCreateRoom";

import { commonState } from "@/provider/common";
import { useModelLogin } from "@/provider/auth";
import { roomState } from "@/provider/room";

export default function SearchHeaderHome() {
  const showNotifyAction = commonState((state) => state.showNotifyAction);
  const userInfo = useModelLogin((state) => state.userInfo);
  const setOpenModalCreateRoom = roomState(
    (state) => state.setOpenModalCreateRoom,
  );
  const setOpenModalLogin = useModelLogin((state) => state.setOpenModalLogin);

  const [status, setStatus] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["open"]),
  );

  const selectedValue = useMemo(() => {
    if (Array.from(selectedKeys)[0] === "open")
      return {
        value: Array.from(selectedKeys)[0],
        label: "Đang mở",
      };

    return {
      value: Array.from(selectedKeys)[0],
      label: "Đã đóng",
    };
  }, [selectedKeys]);

  const debouncedSearch = (e: string) => {
    // TODO
  };

  return (
    <div className="px-2 flex justify-between gap-2">
      <div className="flex gap-2 items-center">
        <Input
          className="w-[250px]  search-element"
          classNames={{
            inputWrapper: ["!bg-white"],
          }}
          label=""
          labelPlacement="outside"
          placeholder="Nhập để tìm kiếm..."
          startContent={
            <Icon
              className="h-6 w-6 text-gray-500 pointer-events-none flex-shrink-0"
              icon="heroicons:magnifying-glass-20-solid"
            />
          }
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") debouncedSearch((e.target as any).value);
          }}
        />
      </div>

      <Button
        className="group-button-element"
        color="primary"
        size="md"
        variant="shadow"
        onClick={() => {
          if (status === false) {
            if (!userInfo?.payment_setting.length)
              showNotifyAction({
                messages:
                  "vui lòng thêm phương thức thanh toán. (Tôi -> Cài đặt thanh toán)",
                type: "warning",
                duration: 2000,
              });
            else {
              setOpenModalCreateRoom(true);
            }
          } else {
            showNotifyAction({
              messages: "vui lòng đăng nhập trước",
              type: "warning",
              duration: 2000,
            });
            setOpenModalLogin(true);
          }
        }}
      >
        <Icon className="h-6 w-6 text-white " icon="ic:twotone-plus" />
        <span className="text-[13px] hidden sm:block ">Đặt Nhóm Ngay</span>
      </Button>
      <ModalCreateRoom />
    </div>
  );
}
