import { create } from 'zustand';

import { GroupDetailResponse } from '@/hooks/api/apps/foodly/group/type';

interface GroupStore {
  groupInfo: GroupDetailResponse | null;
  setGroupInfo: (groupInfo: GroupDetailResponse | null) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  groupInfo: null,
  setGroupInfo: (groupInfo) => set({ groupInfo }),
}));
