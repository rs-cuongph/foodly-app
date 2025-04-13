import { useAuthStore } from '@/stores/auth';

export function useRole() {
  const { isGroupOwner, userInfo } = useAuthStore();
  const isOrderOwner = (createdById: string) => {
    return createdById === userInfo?.id;
  };

  return {
    isGroupOwner,
    isOrderOwner,
  };
}
