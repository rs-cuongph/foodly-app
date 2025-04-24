import { create } from 'zustand';

import { GROUP_STATUS_ENUM } from '@/config/constant';
import { GroupDetailResponse } from '@/hooks/api/apps/foodly/group/type';

interface GroupStore {
  // orderSelected: any | null;
  groupInfo: GroupDetailResponse | null;
  isLocked: () => boolean;
  setGroupInfo: (groupInfo: GroupDetailResponse | null) => void;
  // setOrderSelected: (orderSelected: any | null) => void;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groupInfo: null,
  // orderSelected: null,
  isLocked: () => {
    return get().groupInfo?.status === GROUP_STATUS_ENUM.LOCKED;
  },
  setGroupInfo: (groupInfo) => set({ groupInfo }),
  // setOrderSelected: (orderSelected) => set({ orderSelected }),
}));
