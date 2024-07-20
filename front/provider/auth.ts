import { create } from "zustand";

interface AuthState {
  openModal: boolean;
  setOpenModalLogin: () => void;
}

export const useModelLogin = create<AuthState>()((set) => ({
  openModal: false,
  setOpenModalLogin: () => {
    set((prev) => ({ ...prev, openModal: !prev.openModal }));
  },
}));
