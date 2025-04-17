import { cn } from '@heroui/theme';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import {
  DeleteIcon,
  EditDocumentIcon,
  LockOrderIcon,
  ShareIcon,
} from '@/components/atoms/icons';
import GroupActionBtn, {
  ListboxItem,
} from '@/components/molecules/foodly-apps/group-action-button';
import { GROUP_STATUS_ENUM } from '@/config/constant';
import { useSystemToast } from '@/hooks/toast';
import { useAuthStore } from '@/stores/auth';
import { FormType, ModalType, useCommonStore } from '@/stores/common';
import { useGroupStore } from '@/stores/group';

export default function MoreActionInGroup() {
  const t = useTranslations();
  const { isGroupOwner } = useAuthStore();
  const { groupInfo } = useGroupStore();
  const { showSuccess } = useSystemToast();
  const { setModalConfirm, setIsOpen } = useCommonStore();
  const [_, copy] = useCopyToClipboard();

  const isLocked = useMemo(
    () => groupInfo?.status === GROUP_STATUS_ENUM.LOCKED,
    [groupInfo],
  );

  const items: ListboxItem[] = [
    {
      key: 'edit',
      startContent: <EditDocumentIcon className={'h-5 w-5 text-blue-500'} />,
      text: t('button.edit'),
      description: 'Edit this group',
      className: cn('font-medium text-medium text-black capitalize'),
      showDivider: false,
      isShow: () => !isLocked && !!isGroupOwner(),
      onPress: (setPopoverState: (state: boolean) => void) => {
        setIsOpen(true, ModalType.CREATE_GROUP, FormType.UPDATE_GROUP);
        setPopoverState(false);
      },
    },
    {
      key: 'share',
      startContent: <ShareIcon className={'h-5 w-5 text-green-500'} />,
      text: t('button.share'),
      description: 'Share this group for other users',
      className: cn('font-medium text-medium text-black capitalize'),
      showDivider: false,
      isShow: true,
      onPress: (setPopoverState: (state: boolean) => void) => {
        const url = window.location.href;

        copy(
          `${url}${groupInfo?.invite_code ? `?invite_code=${groupInfo?.invite_code}` : ''}`,
        );
        showSuccess(t('toast.share.success'));
        setPopoverState(false);
      },
    },
    {
      key: 'lock',
      startContent: <LockOrderIcon className="h-5 w-5 text-warning-500" />,
      text: t('button.lock'),
      color: 'warning',
      description: "Lock this group, you can't unlock it later",
      className: cn('font-medium text-medium text-warning capitalize'),
      showDivider: true,
      isShow: () => !isLocked && !!isGroupOwner(),
      onPress: (setPopoverState: (state: boolean) => void) => {
        setPopoverState(false);
        setModalConfirm({
          kind: 'lock',
          isOpen: true,
          isLoadingConfirm: false,
        });
      },
    },
    {
      key: 'delete',
      startContent: <DeleteIcon className={'h-5 w-5 text-danger-500'} />,
      text: t('button.delete'),
      className: cn('font-medium text-medium text-danger capitalize'),
      description: 'Permanently delete this group',
      showDivider: false,
      isShow: () => !isLocked && !!isGroupOwner(),
      color: 'danger',
      onPress: (setPopoverState: (state: boolean) => void) => {
        setPopoverState(false);
        setModalConfirm({
          kind: 'delete',
          isOpen: true,
          isLoadingConfirm: false,
        });
      },
    },
  ];

  return (
    <>
      <GroupActionBtn items={items} />
    </>
  );
}
