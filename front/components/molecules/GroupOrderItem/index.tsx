"use client";

import { Image } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import imageDefault from "@/public/images/image_default.webp";
import { formatCurrency } from "@/shared/helpers/currency";
import { getTimeFromNow } from "@/shared/helpers/format";
import { useModelLogin } from "@/provider/auth";
import { Room } from "@/types/room";
import { commonState } from "@/provider/common";

interface OrderItemProps {
  data: Room;
}

export default function GroupOrderItem({ data }: OrderItemProps) {
  const [time, setTime] = useState(getTimeFromNow(data.public_time_end));
  const setOpenModalLogin = useModelLogin((state) => state.setOpenModalLogin);
  const showNotifyAction = commonState((state) => state.showNotifyAction);
  const setOpenModalOrder = commonState((state) => state.setOpenModalOrder);
  const setRoomIForModalOrder = commonState(
    (state) => state.setRoomIForModalOrder,
  );
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeFromNow(data.public_time_end));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data.public_time_end]);

  const goToDetail = useCallback(() => {}, [data.id]);

  const handleOrder = useCallback(() => {
    if (status === false) {
      setOpenModalOrder(true);
      setRoomIForModalOrder(data);
    } else {
      showNotifyAction({
        messages: "vui lòng đăng nhập trước",
        type: "warning",
        duration: 2000,
      });
      setOpenModalLogin(true);
    }
  }, [data]);

  return (
    <div className="relative card-group-item-element min-w-[280px] max-w-[323px] w-full border shadow-[5px_5px_rgb(203_245_242_/_40%),10px_10px_rgb(225_244_242_/_30%)] rounded-[15px] border-solid border-white bg-[#fff] max-md:w-[calc(50%_-_2rem_-_5px)] max-md:min-w-[316px] max-xss:w-full">
      <Image
        isZoomed
        alt=""
        className="rounded-[15px] h-[165px] object-cover z-0"
        height={165}
        src={imageDefault.src}
        width={323}
      />
      <div className="absolute top-[10px] left-3 shadow-[2px_1px_5px_0px_rgba(211,209,216,1)] min-w-[50px] min-h-[25px] text-[13px] not-italic font-medium leading-[normal] px-2.5 py-1 rounded-xl bg-[#fff]">
        {formatCurrency(data.price, "")}
        <span className="unit ml-1 text-[#fe724c] font-bold mr-[3px];">
          vnđ
        </span>
      </div>

      <div className="border bg-white p-[3px] rounded-[100%] border-solid border-[#0fab07] absolute top-[10px] right-3">
        <div className=" w-2 h-2 bg-[#0fab07] rounded-[100%] " />
      </div>

      <div className="absolute top-[150px] left-3 flex flex-row gap-2">
        <div className="flex flex-row gap-[2px] shadow-[2px_1px_5px_0px_rgba(211,209,216,1)] min-w-[50px] min-h-[25px] text-[13px] not-italic font-bold leading-[normal] px-2.5 py-[5px] rounded-xl bg-[#fff]">
          <Icon
            className="h-4 w-4 text-primary"
            icon="teenyicons:hashtag-solid"
          />
          {data.room_id}
        </div>
        <div className="flex flex-row gap-[2px] shadow-[2px_1px_5px_0px_rgba(211,209,216,1)] min-w-[50px] min-h-[25px] text-[13px] not-italic font-bold leading-[normal] px-2.5 py-[5px] rounded-xl bg-[#fff]">
          <Icon
            className="h-4 w-4 text-primary"
            icon="ant-design:usergroup-add-outlined"
          />
          {data.total_item}
        </div>
        <div className="flex flex-row gap-[2px] shadow-[2px_1px_5px_0px_rgba(211,209,216,1)] min-w-[50px] min-h-[25px] text-[13px] not-italic font-bold leading-[normal] px-2.5 py-[5px] rounded-xl bg-[#fff]">
          <Icon className="h-4 w-4 text-primary" icon="ph:clock-bold" />
          {time}
        </div>
      </div>
      <div className="px-[22px] py-4">
        <h4 className="text-black text-[18.214px] not-italic font-semibold leading-[normal]">
          {data.name}
        </h4>
        <div className="mt-[10px] flex flex-row gap-1 items-center">
          <Icon className="h-4 w-4 text-primary" icon="mdi:user" />
          <h5 className="m-0 text-[13px] font-[500]">
            {data.creator.username}
          </h5>
        </div>
        <div className="mt-[20px] flex flex-row gap-2">
          <Button
            className="text-sm not-italic font-normal leading-[normal]"
            color="primary"
            onClick={goToDetail}
          >
            <Icon
              className="h-4 w-4 text-white"
              icon="mdi:information-outline"
            />
            Chi Tiết
          </Button>

          {time !== 0 && (
            <Button
              className="text-sm not-italic font-normal leading-[normal]"
              color="primary"
              variant="bordered"
              onClick={handleOrder}
            >
              <Icon className="h-4 w-4 text-primary" icon="wpf:shoppingcart" />
              Đặt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
