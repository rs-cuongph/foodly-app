import MyButton from '@/components/atoms/Button';
import {
  CheckCircleIcon,
  CopyIcon,
  DeleteIcon,
  QRCodeIcon,
} from '@/components/atoms/icons';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { OrderListItem } from '@/hooks/api/order/type';
import { useRole } from '@/hooks/apps/foodly/role';
import { FormType, ModalType, useCommonStore } from '@/stores/common';

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
      color: 'primary',
      icon: <QRCodeIcon className="h-6 w-6 text-primary" />,
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
    {
      key: 'confirm_paid',
      color: 'success',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
      isShow:
        isGroupOwner() &&
        checkIncludes(
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
      isShow:
        // check if group owner and order status is init or processing
        (isGroupOwner() &&
          checkIncludes(
            [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
            order.status,
          )) ||
        // check if order owner and group is not locked and order status is init or processing
        (isOrderOwner(order.created_by_id) &&
          !isGroupLocked() &&
          checkIncludes(
            [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
            order.status,
          )),
      onPress: () => {
        setModalConfirm({
          isOpen: true,
          kind: 'cancel_order',
          data: { orderId: order.id },
        });
      },
    },
    {
      key: 'copy',
      color: 'secondary',
      icon: <CopyIcon className="h-6 w-6 text-secondary-500" />,
      isShow: !isGroupLocked(),
      onPress: () => {
        setDataModalUpsertOrder({
          menuItems: order.menu,
          quantity: order.quantity,
          note: order.note,
        });
        setIsOpen(true, ModalType.UPSERT_ORDER, FormType.SETTING_ORDER);
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
