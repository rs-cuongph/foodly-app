import MyButton from '@/components/atoms/Button';
import {
  CheckCircleIcon,
  CopyIcon,
  DeleteIcon,
  QRCodeIcon,
} from '@/components/atoms/icons';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { OrderListItem } from '@/hooks/api/apps/foodly/order/type';
import { useRole } from '@/hooks/apps/foodly/role';

type OrderActionTableProps = {
  order: OrderListItem;
};

type Action = {
  key: string;
  color: 'default' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  icon: React.ReactNode;
  isShow: boolean;
  onPress: () => void;
};

const OrderActionTable = (props: OrderActionTableProps) => {
  const { order } = props;

  const { isGroupOwner, isOrderOwner } = useRole();

  const checkIncludes = (statuses: ORDER_STATUS_ENUM[], status: string) => {
    return statuses.some((s) => s == status);
  };

  const actions: Action[] = [
    {
      key: 'confirm_paid',
      color: 'primary',
      icon: <QRCodeIcon className="h-6 w-6 text-primary" />,
      isShow:
        isOrderOwner(order.created_by_id) &&
        checkIncludes(
          [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
          order.status,
        ),
      onPress: () => {},
    },
    {
      key: 'mark_paid',
      color: 'success',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      isShow:
        isGroupOwner() &&
        checkIncludes(
          [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
          order.status,
        ),
      onPress: () => {},
    },
    {
      key: 'cancel',
      color: 'danger',
      icon: <DeleteIcon className="h-6 w-6 text-red-500" />,
      isShow:
        isGroupOwner() &&
        checkIncludes(
          [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
          order.status,
        ),
      onPress: () => {},
    },
    {
      key: 'copy',
      color: 'secondary',
      icon: <CopyIcon className="h-6 w-6 text-secondary-500" />,
      isShow:
        isOrderOwner(order.created_by_id) &&
        checkIncludes(
          [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
          order.status,
        ),
      onPress: () => {},
    },
  ];

  const filteredActions = (actions: Action[]) => {
    return actions.filter((action) => {
      return action.isShow;
    });
  };

  return (
    <div className="flex flex-row gap-2">
      {filteredActions(actions).map((action) => (
        <MyButton
          key={action.key}
          isIconOnly
          color={action.color}
          variant="light"
          onClick={action.onPress}
        >
          {action.icon}
        </MyButton>
      ))}
    </div>
  );
};

OrderActionTable.displayName = 'OrderActionTable';

export default OrderActionTable;
