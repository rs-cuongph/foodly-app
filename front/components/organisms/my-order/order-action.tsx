import MyButton from '@/components/atoms/Button';
import { QRCodeIcon } from '@/components/atoms/icons';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { OrderListItem } from '@/hooks/api/order/type';
import { useRole } from '@/hooks/apps/foodly/role';
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
  const { setIsOpen, setModalConfirm, setDataModalUpsertOrder } =
    useCommonStore();
  const { isGroupOwner, isOrderOwner, isGroupLocked } = useRole();

  const checkIncludes = (statuses: ORDER_STATUS_ENUM[], status: string) => {
    return statuses.some((s) => s == status);
  };

  const actions: Action[] = [
    {
      key: 'mark_paid',
      color: 'success',
      icon: <QRCodeIcon className="h-6 w-6 text-success" />,
      isShow:
        isOrderOwner(order.created_by_id) &&
        checkIncludes(
          [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
          order.status,
        ),
      onPress: () => {
        const transaction = {
          unique_code: order.transaction.unique_code,
          amount: order.transaction.metadata.amount,
          payment_setting: order.transaction.metadata.payment_setting,
        };

        setModalConfirm({
          isOpen: true,
          kind: 'qr_code',
          data: {
            orderId: order.id,
            qrCode: order.transaction.unique_code,
            orderStatus: order.status,
            transaction: transaction,
          },
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
