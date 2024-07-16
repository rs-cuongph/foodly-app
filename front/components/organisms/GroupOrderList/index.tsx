"use client";

import { Spinner } from "@nextui-org/react";
import { useEffect } from "react";

import GroupOrderItem from "@/components/molecules/GroupOrderItem";
import { Scroller } from "@/components/atoms/Scroller";
import { useWindowSize } from "@/hooks/window-size";
import { Room } from "@/types/room";
import { roomState } from "@/provider/room";

export default function GroupOrderList() {
  const { isMobile } = useWindowSize();
  const params = roomState((state) => state.searchParams);
  const loading = false;
  const rooms = roomState((state) => state.rooms);

  useEffect(() => {}, [params]);

  if (loading)
    return (
      <div className="flex p-2 justify-center bg-white rounded">
        <Spinner color="primary" />
      </div>
    );

  return rooms.pagination.total_record ? (
    <Scroller height={`calc(100vh - ${isMobile ? 190 : 130}px)`}>
      <div className="flex flex-row flex-wrap justify-start gap-y-5 gap-x-[30px] p-2.5 max-xss:justify-around max-md:justify-between">
        {rooms.data.map((item: Room) => (
          <GroupOrderItem key={item.room_id} data={item} />
        ))}
      </div>
    </Scroller>
  ) : (
    <div className="bg-white p-2 rounded text-center text-[14px]">
      Không có dữ liệu
    </div>
  );
}
