import { GROUP_STATUS_ENUM } from '@/config/constant';
import { useAuthStore } from '@/stores/auth';
import { useGroupStore } from '@/stores/group';

export function useRole() {
  const { groupInfo } = useGroupStore();
  const { isGroupOwner, userInfo } = useAuthStore();
  const isOrderOwner = (createdById: string) => {
    return createdById === userInfo?.id;
  };
  const isGroupLocked = () => {
    return groupInfo?.status === GROUP_STATUS_ENUM.LOCKED;
  };

  return {
    isGroupOwner,
    isOrderOwner,
    isGroupLocked,
  };
}
