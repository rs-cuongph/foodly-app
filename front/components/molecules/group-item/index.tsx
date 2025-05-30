import { HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import { MyButton } from '@/components/atoms/Button';
import {
  GroupOwnerIcon,
  MoneyIcon,
  ShoppingBagIcon,
  SquareInformationIcon,
  TimerIcon,
} from '@/components/atoms/icons';
import InviteCodeModal from '@/components/organisms/invite-code-modal';
import { STORAGE_KEYS } from '@/config/constant';
import { siteConfig } from '@/config/site';
import { checkGroupApi, useGetGroupQuery } from '@/hooks/api/group';
import { useSystemToast } from '@/hooks/toast';
import { useRouter } from '@/i18n/navigation';
import { DateHelper } from '@/shared/helper/date';
import { commaFormat } from '@/shared/helper/format';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

type MenuItem = {
  name: string;
  price: string;
};

interface GroupCardItemProps {
  groupId: string;
  groupCode: string;
  groupName: string;
  createdBy: string;
  orderCount: number;
  totalQuantity: number;
  createdAt: string;
  expiredAt: string;
  menuItems: MenuItem[];
  groupPrice: string;
}

export default function GroupCardItem(props: GroupCardItemProps) {
  const {
    groupId,
    groupCode,
    groupName,
    createdBy,
    orderCount,
    // totalQuantity,
    // createdAt,
    expiredAt,
    menuItems,
    groupPrice,
  } = props;
  const t = useTranslations();
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const commonStore = useCommonStore();
  const authStore = useAuthStore();
  const { showError } = useSystemToast();
  const { setGroupInfo } = useGroupStore();
  const [inviteCodes, setInviteCodes] = useSessionStorage<
    Record<string, string>
  >(STORAGE_KEYS.GROUP_INVITE_CODE, {});

  const isSamePrice = Number(groupPrice) > 0;
  const menuPrice = menuItems.map((item) => Number(item.price));
  const minPrice = Math.min(...menuPrice);
  const maxPrice = Math.max(...menuPrice);
  const [timeCountDown, setTimeCountDown] = useState(0);
  const [allowLoadGroup, setAllowLoadGroup] = useState(false);
  const [openInviteCodeModal, setOpenInviteCodeModal] = useState(false);
  const canCreateOrder = authStore.canCreateOrder();
  const { data: groupInfoRes } = useGetGroupQuery(
    groupId,
    { invite_code: inviteCodes[groupId] },
    allowLoadGroup,
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const oneDay = 24 * 60 * 60 * 1000;
    const diff = calculateTimeCountDown();

    if (diff > 0) {
      if (diff < oneDay) {
        interval = setInterval(() => {
          setTimeCountDown(calculateTimeCountDown());
        }, 1000);
      } else {
        setTimeCountDown(calculateTimeCountDown());
      }
    }

    return () => clearInterval(interval);
  }, []);

  const calculateTimeCountDown = () => {
    const now = DateHelper.getNow();
    const createdAtDate = DateHelper.toDayjs(expiredAt);
    const diffInSeconds = createdAtDate.diff(now, 'seconds');

    if (diffInSeconds > 0) {
      return diffInSeconds;
    }

    return 0;
  };

  const formatTimeCountDown = () => {
    const seconds = calculateTimeCountDown();

    return DateHelper.formatSecondsToTime(seconds);
  };

  const goToDetailGroup = () => {
    router.push(siteConfig.apps.routes.group.detail.replace(':id', groupId));
  };

  const handleAcceptInviteCode = async (invite_code: string) => {
    try {
      setInviteCodes((prev) => ({ ...prev, [groupId]: invite_code }));
      setAllowLoadGroup(true);
      setOpenInviteCodeModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseInviteCodeModal = () => {
    setOpenInviteCodeModal(false);
  };

  const openOrderModal = () => {
    if (!isLoggedIn)
      return commonStore.setIsOpen(true, ModalType.AUTH, FormType.SIGN_IN);

    if (!canCreateOrder) {
      return showError(
        t('system_message.error.cannot_create_order'),
        t('system_message.error.create_order_failed'),
      );
    }

    checkGroupApi(groupId).then((res) => {
      const canAccess = res.canAccess;
      const inviteCode = inviteCodes[groupId];

      if (inviteCode || canAccess) return handleAcceptInviteCode(inviteCode);

      setOpenInviteCodeModal(!canAccess);
    });

    commonStore.setIsOpen(true, ModalType.UPSERT_ORDER, FormType.SETTING_ORDER);
  };

  useEffect(() => {
    if (groupInfoRes) {
      setGroupInfo(groupInfoRes);
    }
  }, [groupInfoRes]);

  return (
    <div className="relative w-full rounded-3xl bg-white shadow-md md:max-w-[398px] h-fit drop-shadow-md">
      {/* Image and Overlay Info */}
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl">
        <Image
          fill
          alt="Food"
          className="object-cover"
          src={'/images/image_default.webp'}
        />
        <div className="absolute left-4 top-4 flex gap-4">
          <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1">
            <MoneyIcon className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm text-black mr-1">
              {isSamePrice
                ? commaFormat(Number(groupPrice))
                : `${commaFormat(minPrice)} ~ ${commaFormat(maxPrice)}`}
            </span>
          </div>
        </div>
        {timeCountDown > 0 ? (
          <span className="flex absolute top-4 right-4 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
        ) : (
          <span className="flex absolute top-4 right-4 h-3 w-3 bg-gray-400 rounded-full" />
        )}
      </div>
      <div className="absolute top-[176px] left-4 flex gap-4">
        <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
          <HashtagIcon className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-bold">{groupCode}</span>
        </div>
        <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
          <UserGroupIcon className="h-4 w-4 text-primary" />
          <span className="text-black text-sm font-bold">{orderCount}</span>
        </div>
        {timeCountDown > 0 && (
          <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 shadow-primary">
            <TimerIcon className="h-4 w-4 text-primary" />
            <span className="text-black text-sm font-bold">
              {formatTimeCountDown()}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Menu */}
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-bold text-ellipsis line-clamp-1 break-words">
            {groupName}
          </h3>
          <ul className="list-inside list-disc space-y-1 pl-4 min-h-[80px]">
            {menuItems.slice(0, 3).map((item, index) => (
              <li
                key={index}
                className="text-primary text-ellipsis line-clamp-1 break-words"
              >
                - {item.name}
              </li>
            ))}
          </ul>
        </div>
        {/* Owner Group */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <GroupOwnerIcon className="min-h-6 min-w-6 text-primary" />
            <span className="font-bold text-md text-ellipsis break-all line-clamp-1">
              {createdBy}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <MyButton className="group" variant="ghost" onPress={goToDetailGroup}>
            <SquareInformationIcon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            <span className="group-hover:text-primary-foreground">
              {t('button.detail')}
            </span>
          </MyButton>
          <MyButton className="" onPress={openOrderModal}>
            <ShoppingBagIcon className="h-5 w-5 text-white group-hover:text-primary-foreground" />
            <span className="group-hover:text-primary-foreground">
              {t('button.order')}
            </span>
          </MyButton>
        </div>
      </div>
      <InviteCodeModal
        isOpen={openInviteCodeModal}
        onClose={() => handleCloseInviteCodeModal()}
        onSubmit={handleAcceptInviteCode}
      />
    </div>
  );
}
