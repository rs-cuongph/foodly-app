import MyButton from '@/components/atoms/Button';
import { CheckCircleIcon, DeleteIcon } from '@/components/atoms/icons';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { OrderListItem } from '@/hooks/api/order/type';
import { useCommonStore } from '@/stores/common';

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
  const { setModalConfirm } = useCommonStore();

  const checkIncludes = (statuses: ORDER_STATUS_ENUM[], status: string) => {
    return statuses.some((s) => s == status);
  };

  const actions: Action[] = [
    {
      key: 'confirm_paid',
      color: 'success',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      isShow: checkIncludes(
        [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
        order.status,
      ),
      onPress: () => {
        setModalConfirm({
          isOpen: true,
          kind: 'confirm_paid',
          data: { orderId: order.id },
        });
      },
    },
    {
      key: 'cancel',
      color: 'danger',
      icon: <DeleteIcon className="h-6 w-6 text-red-500" />,
      isShow: checkIncludes(
        [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
        order.status,
      ),
      onPress: () => {
        setModalConfirm({
          isOpen: true,
          kind: 'cancel_order',
          data: { orderId: order.id },
        });
      },
    },
  ];

  const filteredActions = (actions: Action[]) => {
    return actions.filter((action) => {
      return action.isShow;
    });
  };

  return (
    <div className="flex flex-row">
      {filteredActions(actions).map((action) => (
        <MyButton
          key={action.key}
          isIconOnly
          color={action.color}
          variant="light"
          onPress={action.onPress}
        >
          {action.icon}
        </MyButton>
      ))}
    </div>
  );
};

export default OrderActionTable;
