import { create } from "zustand";

import { PAGINATION_PARAMS } from "@/shared/constants";
import {
  ListRoomResponseI,
  ListUserI,
  Room,
  SearchParamsI,
} from "@/types/room";

interface roomState {
  isFetchingList: boolean;
  isFetchingListUser: boolean;
  isFetchingRoom: boolean;
  isCreating: boolean;
  error?: string | null;
  rooms: ListRoomResponseI;
  users: ListUserI;
  searchParams: SearchParamsI;
  room: Room;
  isOpenModalCreateOrder: boolean;
  resetParams: () => void;
  setOpenModalCreateRoom: (isOpenModalCreateOrder: boolean) => void;
}

const initialState = {
  isFetchingList: false,
  isFetchingRoom: false,
  isFetchingListUser: false,
  isCreating: false,
  error: null,
  searchParams: {
    page: 1,
    page_size: PAGINATION_PARAMS.DEFAULT_PAGE_SIZE,
    keywords: "",
  },
  rooms: {
    data: [],
    pagination: {
      page: 1,
      total_record: 0,
    },
  },
  users: {
    count: 0,
    items: [],
  },
  room: {
    deleted_at: "",
    room_id: "",
    name: "",
    description: "",
    creator: {
      email: "",
      role: "",
      id: "",
      username: "",
      payment_setting: [],
    },
    invited_people: [],
    total_item: 0,
    public_time_start: "",
    public_time_end: "",
    price: 0,
    share_scope: "",
    created_at: "",
    updated_at: "",
    id: "",
  },
  isOpenModalCreateOrder: false,
};

export const roomState = create<roomState>()((set) => ({
  ...initialState,
  resetParams: () => {
    set(() => {
      return { ...initialState };
    });
  },
  setOpenModalCreateRoom: (isOpenModalCreateOrder: boolean) => {
    set(() => {
      return {
        ...initialState,
        isOpenModalCreateOrder: isOpenModalCreateOrder,
      };
    });
  },
}));
