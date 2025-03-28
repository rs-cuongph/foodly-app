import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

import { Room } from "../types/room";
import { Order } from "../types/order";

interface NotifyState {
  type: "error" | "success" | "warning";
  duration?: number;
  id?: string | number;
  messages: string;
}

interface CommonState {
  loading: boolean;
  notify: NotifyState[];
  modalOrderState: {
    open: boolean;
    room: Room | null;
    order?: Order | null;
  };
  showNotifyAction: (payload: any) => void;
  clearNotify: (id?: string | number) => void;
  setOpenModalOrder: (open: boolean) => void;
  setRoomIForModalOrder: (room: Room) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const initialState = {
  loading: false,
  notify: [],
  modalOrderState: {
    open: false,
    room: null,
    order: null,
  },
};

export const commonState = create<CommonState>()((set) => ({
  ...initialState,
  showNotifyAction: (payload) => {
    set((prev) => {
      const _id = uuidv4();
      const notify = prev.notify;

      notify.push({
        ...payload,
        id: _id,
      });

      return { ...prev, notify: notify };
    });
  },
  clearNotify(id?: string | number) {
    set((prev) => {
      let notify = prev.notify;

      if (!id) notify = [];
      else {
        const index = prev.notify.findIndex((i) => i.id === id);

        notify.splice(index, 1);
      }

      return { ...prev, notify: notify };
    });
  },
  setOpenModalOrder(payload: boolean) {
    set((prev) => {
      const modalOrderState = prev.modalOrderState;

      return {
        ...prev,
        modalOrderState: {
          ...modalOrderState,
          open: payload,
        },
      };
    });
  },
  setRoomIForModalOrder(payload: Room) {
    set((prev) => {
      const modalOrderState = prev.modalOrderState;

      return {
        ...prev,
        modalOrderState: {
          ...modalOrderState,
          room: {
            ...modalOrderState.room,
            ...payload,
          },
        },
      };
    });
  },
  showLoading() {
    set((prev) => ({ ...prev, loading: true }));
  },
  hideLoading() {
    set((prev) => ({ ...prev, loading: true }));
  },
}));
