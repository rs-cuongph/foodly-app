import { create } from 'zustand';

import { useGroupStore } from './group';

import { OrderListItem } from '@/hooks/api/apps/foodly/order/type';
import { UserInfoResponse } from '@/hooks/api/auth/type';

type User = UserInfoResponse;
interface AuthStore {
  isLoggedIn: boolean;
  userInfo: User | null;
  setUserInfo: (userInfo: User) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isGroupOwner: () => boolean;
  // isOrderOwner: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  userInfo: null,
  isGroupOwner: () => {
    const groupInfo = useGroupStore.getState().groupInfo;

    return groupInfo?.created_by_id === get().userInfo?.id;
  },
  isOrderOwner: (order: OrderListItem) => {
    return order.created_by_id === get().userInfo?.id;
  },
  setUserInfo: (userInfo) => set({ userInfo }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
