import { create } from 'zustand';

import { UserInfoResponse } from '@/hooks/api/auth/type';

type User = UserInfoResponse;
interface AuthStore {
  isLoggedIn: boolean;
  userInfo: User | null;
  setUserInfo: (userInfo: User) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
