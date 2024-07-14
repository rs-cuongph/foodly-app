import { create } from "zustand";

import { UserInfo } from "@/types/auth";

interface AuthState {
  userInfo: null | UserInfo["info"];
  openModal: boolean;
  setOpenModalLogin: (openModal: boolean) => void;
}

export const useModelLogin = create<AuthState>()((set) => ({
  userInfo: null,
  openModal: false,
  setOpenModalLogin: (payload) => {
    set((prev) => ({ ...prev, openModal: payload }));
  },
}));
