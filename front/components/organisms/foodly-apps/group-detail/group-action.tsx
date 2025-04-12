import { cn } from '@heroui/theme';
import { useTranslations } from 'next-intl';

import {
  DeleteIcon,
  EditDocumentIcon,
  LockOrderIcon,
  ShareIcon,
} from '@/components/atoms/icons';
import GroupActionBtn, {
  ListboxItem,
} from '@/components/molecules/foodly-apps/group-action-button';

export default function MoreActionInGroup() {
  const t = useTranslations();
  const items: ListboxItem[] = [
    {
      key: 'edit',
      startContent: <EditDocumentIcon className={'h-5 w-5 text-blue-500'} />,
      text: t('button.edit'),
      description: 'Edit this group',
      className: cn('font-medium text-medium text-black'),
      showDivider: false,
      isShow: true,
      onPress: () => {},
    },
    {
      key: 'share',
      startContent: <ShareIcon className={'h-5 w-5 text-green-500'} />,
      text: t('button.share'),
      description: 'Share this group for other users',
      className: cn('font-medium text-medium text-black'),
      showDivider: false,
      isShow: true,
      onPress: () => {},
    },
    {
      key: 'lock',
      startContent: <LockOrderIcon className="h-5 w-5 text-warning-500" />,
      text: t('button.lock'),
      color: 'warning',
      description: "Lock this group, you can't unlock it later",
      className: cn('font-medium text-medium text-warning'),
      showDivider: true,
      isShow: true,
      onPress: () => {},
    },
    {
      key: 'delete',
      startContent: <DeleteIcon className={'h-5 w-5 text-danger-500'} />,
      text: t('button.delete'),
      className: cn('font-medium text-medium text-danger'),
      description: 'Permanently delete this group',
      showDivider: false,
      isShow: true,
      color: 'danger',
      onPress: () => {},
    },
  ];

  return (
    <>
      <GroupActionBtn items={items} />
    </>
  );
}
