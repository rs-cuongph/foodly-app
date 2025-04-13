import { cn } from '@heroui/theme';
import { useTranslations } from 'next-intl';

import { ORDER_STATUS_ENUM } from '@/config/constant';
import StatusHelper from '@/shared/helper/status';

export type BadgeStatusProps = {
  status: string;
  className?: string;
};

export const BadgeStatus = (props: BadgeStatusProps) => {
  const t = useTranslations();

  StatusHelper.setTranslation(t);
  const statusText = StatusHelper.getStatusText(props.status);
  const mapClass = {
    [ORDER_STATUS_ENUM.INIT]: 'bg-secondary/20 text-secondary-600',
    [ORDER_STATUS_ENUM.PROCESSING]: 'bg-warning/20 text-warning-700',
    [ORDER_STATUS_ENUM.COMPLETED]: 'bg-success/20 text-success-700',
    [ORDER_STATUS_ENUM.CANCELED]: 'bg-danger/20 text-danger-600',
  };

  return (
    <span
      className={cn(
        props.className,
        mapClass[props.status as ORDER_STATUS_ENUM],
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
      )}
    >
      {statusText}
    </span>
  );
};
