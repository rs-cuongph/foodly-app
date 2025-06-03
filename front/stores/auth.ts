import { create } from 'zustand';

import { useGroupStore } from './group';

import { PaymentSetting, UserInfoResponse } from '@/hooks/api/auth/type';
import { OrderListItem } from '@/hooks/api/order/type';

interface AuthStore {
  isLoggedIn: boolean;
  userInfo: UserInfoResponse | null;
  email: string;
  paymentSettings: () => PaymentSetting[];
  setUserInfo: (userInfo: UserInfoResponse) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isGroupOwner: () => boolean;
  canCreateOrder: () => boolean;
  setCountInitOrder: (count: number) => void;
  setCountProcessingOrder: (count: number) => void;
  deletePaymentSetting: (index: number) => void;
  setPaymentSetting: (paymentSetting: PaymentSetting[]) => void;
  setDisplayName: (displayName: string) => void;
  setEmail: (email: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  userInfo: null,
  email: '',
  paymentSettings: () => {
    return get().userInfo?.payment_setting ?? [];
  },
  isGroupOwner: () => {
    const groupInfo = useGroupStore.getState().groupInfo;

    return groupInfo?.created_by_id === get().userInfo?.id;
  },
  isOrderOwner: (order: OrderListItem) => {
    return order.created_by_id === get().userInfo?.id;
  },
  setUserInfo: (userInfo) => set({ userInfo }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  canCreateOrder: () => {
    return get().userInfo?.can_create_order ?? false;
  },
  setCountInitOrder: (count) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            count_init_order: count,
          }
        : null,
    })),
  setCountProcessingOrder: (count) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            count_processing_order: count,
          }
        : null,
    })),
  deletePaymentSetting: (index: number) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            payment_setting: state.userInfo.payment_setting.filter(
              (_: PaymentSetting, i: number) => i !== index,
            ),
          }
        : null,
    })),

  setPaymentSetting: (paymentSetting) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            payment_setting: paymentSetting,
          }
        : null,
    })),
  setDisplayName: (displayName) =>
    set((state) => ({
      userInfo: state.userInfo
        ? { ...state.userInfo, display_name: displayName }
        : null,
    })),
  setEmail: (email) => set({ email }),
}));
