'use client';

import { HashtagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import MyButton from '@/components/atoms/Button';
import {
  AnonymousIcon,
  ChatIcon,
  HomeShareIcon,
  LockIcon,
  MoneyIcon,
  ShoppingBagIcon,
  TimerIcon,
} from '@/components/atoms/icons';
import SkeletonWrapper from '@/components/molecules/skeleton-wrapper';
import MoreActionInGroup from '@/components/organisms/group-detail/group-action';
import OrderListTable from '@/components/organisms/group-detail/order-list';
import InviteCodeModal from '@/components/organisms/invite-code-modal';
import {
  GROUP_STATUS_ENUM,
  SHARE_SCOPE_ENUM,
  STORAGE_KEYS,
} from '@/config/constant';
import { siteConfig } from '@/config/site';
import { checkGroupApi, useGetGroupQuery } from '@/hooks/api/group';
import { useSystemToast } from '@/hooks/toast';
import { useWindowSize } from '@/hooks/window-size';
import { useRouter } from '@/i18n/navigation';
import { DateHelper } from '@/shared/helper/date';
import { commaFormat } from '@/shared/helper/format';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

export default function GroupDetail() {
  const router = useRouter();
  const t = useTranslations();
  const { isMobile } = useWindowSize();
  const { id } = useParams<{ id: string | undefined }>();
  const [inviteCodes, setInviteCodes] = useSessionStorage<
    Record<string, string>
  >(STORAGE_KEYS.GROUP_INVITE_CODE, {});
  const [allowLoadGroup, setAllowLoadGroup] = useState(false);
  const { groupInfo, setGroupInfo } = useGroupStore();
  const { data: groupInfoRes } = useGetGroupQuery(
    id!,
    { invite_code: inviteCodes[id ?? ''] },
    allowLoadGroup,
  );
  const { setIsOpen } = useCommonStore();
  const authStore = useAuthStore();
  const { showError } = useSystemToast();

  const [isLoaded, setIsLoaded] = useState(false);
  const [openInviteCodeModal, setOpenInviteCodeModal] = useState(false);
  const [timeCountDown, setTimeCountDown] = useState(0);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const groupPrice = Number(groupInfo?.price ?? 0);
  const isSamePrice = Number(groupInfo?.price ?? 0) > 0;
  const canCreateOrder = authStore.canCreateOrder();
  const menuPrice = groupInfo?.menu_items.map((item) => Number(item.price));
  const minPrice = useMemo(() => Math.min(...(menuPrice ?? [])), [menuPrice]);
  const maxPrice = useMemo(() => Math.max(...(menuPrice ?? [])), [menuPrice]);
  const isLocked = useMemo(
    () => groupInfo?.status === GROUP_STATUS_ENUM.LOCKED,
    [groupInfo],
  );

  const calculateTimeCountDown = () => {
    if (!groupInfo?.public_end_time) return 0;

    const now = DateHelper.getNow();
    const createdAtDate = DateHelper.toDayjs(groupInfo.public_end_time);
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

  const handleCloseInviteCodeModal = () => {
    setOpenInviteCodeModal(false);
    router.push(siteConfig.apps.routes.home);
  };

  const getGroupInfo = async (invite_code: string) => {
    try {
      setInviteCodes((prev) => ({ ...prev, [id!.toString()]: invite_code }));
      setAllowLoadGroup(true);
      setOpenInviteCodeModal(false);
    } catch (error) {
      throw error;
    }
  };

  const renderStatusIcon = () => {
    if (!groupInfo) return null;

    if (isLocked) {
      return <LockIcon className="h-6 w-6 text-black-500" />;
    }

    if (groupInfo?.share_scope === SHARE_SCOPE_ENUM.PRIVATE) {
      return <AnonymousIcon className="h-6 w-6 text-primary-500" />;
    }

    return <HomeShareIcon className="h-6 w-6 text-green-500" />;
  };

  const openOrderModal = () => {
    if (!authStore.isLoggedIn)
      return setIsOpen(true, ModalType.AUTH, FormType.SIGN_IN);

    if (!canCreateOrder) {
      return showError(
        t('system_message.error.cannot_create_order'),
        t('system_message.error.create_order_failed'),
      );
    }
    setIsOpen(true, ModalType.UPSERT_ORDER, FormType.SETTING_ORDER);
  };

  useEffect(() => {
    if (groupInfoRes) {
      setGroupInfo(groupInfoRes);
      setIsLoaded(true);
    }
  }, [groupInfoRes]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (groupInfo) {
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
    }

    return () => clearInterval(interval);
  }, [groupInfo]);

  useEffect(() => {
    if (id) {
      checkGroupApi(id).then((res) => {
        const canAccess = res.canAccess;
        const inviteCode = inviteCodes[id as string];

        if (inviteCode || canAccess) return getGroupInfo(inviteCode);

        setOpenInviteCodeModal(!canAccess);
      });
    }
  }, [id]);

  return (
    <>
      <div className="relative">
        <div className="flex flex-col md:flex-row gap-4">
          <SkeletonWrapper
            classNames={{
              base: 'relative rounded-xl h-auto md:min-w-[238px] md:min-h-[168px]',
              content:
                'relative pb-[55%] md:min-w-[238px] md:min-h-[168px] md:pb-[0%]', // 4:3 aspect ratio (width:height), 3/4 = 75%
            }}
            isLoaded={isLoaded}
          >
            <Image
              fill
              alt="Foodly"
              className="object-cover rounded-xl"
              src={'/images/image_default.webp'}
            />
          </SkeletonWrapper>
          <SkeletonWrapper
            classNames={{
              base: 'relative rounded-xl w-full',
              content:
                'relative border border-gray-200 rounded-xl w-full bg-white px-4 pt-4 pb-4 min-h-[200px] h-full overflow-auto justify-between',
            }}
            isLoaded={isLoaded}
          >
            <div className="flex flex-row gap-2 justify-between">
              <div className="flex flex-row gap-2 flex-start-0">
                <div className="flex items-center mr-2">
                  {renderStatusIcon()}
                </div>
                <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 border border-primary shadow-lg shadow-primary">
                  <HashtagIcon className="h-4 w-4 text-primary" />
                  <span className="text-black text-sm font-bold">
                    {groupInfo?.code}
                  </span>
                </div>
                <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 border border-primary min-w-16 shadow-lg shadow-primary">
                  <UserGroupIcon className="h-4 w-4 text-primary" />
                  <span className="text-black text-sm font-bold">
                    {groupInfo?.order_count ?? 0}
                  </span>
                </div>
                {timeCountDown > 0 && (
                  <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 border border-primary shadow-lg shadow-primary">
                    <TimerIcon className="h-4 w-4 text-primary" />
                    <span className="text-black text-sm font-bold">
                      {formatTimeCountDown()}
                    </span>
                  </div>
                )}
                <div className="rounded-full bg-white px-3 py-1 flex items-center gap-1 border border-primary shadow-lg shadow-primary">
                  <MoneyIcon className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm text-black mr-1">
                    {isSamePrice
                      ? commaFormat(Number(groupPrice))
                      : minPrice === maxPrice
                        ? commaFormat(minPrice)
                        : `${commaFormat(minPrice)} ~ ${commaFormat(maxPrice)}`}
                  </span>
                </div>
              </div>
              <MoreActionInGroup />
            </div>
            <div className="flex flex-row gap-2 min-h-[calc(100%_-_40px)] w-full">
              <div className="mt-5 flex-1">
                <h3 className="mb-2 text-xl font-bold text-ellipsis line-clamp-1 break-all">
                  {groupInfo?.name}
                </h3>
                <div className="flex flex-col">
                  <div
                    className={`${showMoreItems ? 'max-h-32 overflow-y-auto pr-2 custom-scrollbar' : ''}`}
                  >
                    <ul className="list-inside list-disc space-y-1 pl-4">
                      {groupInfo?.menu_items
                        .slice(
                          0,
                          showMoreItems ? groupInfo.menu_items.length : 3,
                        )
                        .map((item, index) => (
                          <li
                            key={index}
                            className="text-primary text-ellipsis line-clamp-1 break-all"
                          >
                            - {item.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                  {groupInfo?.menu_items && groupInfo.menu_items.length > 3 && (
                    <button
                      className="text-gray-400 text-sm mt-1 self-center hover:underline focus:outline-none"
                      onClick={() => setShowMoreItems(!showMoreItems)}
                    >
                      {showMoreItems
                        ? t('button.see_less')
                        : t('button.see_more')}
                    </button>
                  )}
                </div>
              </div>

              {!isLocked && (
                <div className="flex flex-row gap-2 items-end">
                  <MyButton key="sss" className="group/chat" variant="ghost">
                    <ChatIcon className="h-5 w-5 text-primary group-hover/chat:text-primary-foreground" />
                    {t('button.chat')}
                  </MyButton>
                  <MyButton className="" onPress={openOrderModal}>
                    <ShoppingBagIcon className="h-5 w-5 text-white " />
                    {t('button.order')}
                  </MyButton>
                </div>
              )}
            </div>
          </SkeletonWrapper>
        </div>
      </div>
      <OrderListTable className="mt-5" groupId={groupInfo?.id} />

      <InviteCodeModal
        isOpen={openInviteCodeModal}
        onClose={() => handleCloseInviteCodeModal()}
        onSubmit={getGroupInfo}
      />
    </>
  );
}
