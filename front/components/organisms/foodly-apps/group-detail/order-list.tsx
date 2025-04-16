import { Pagination } from '@heroui/react';
import { cn } from '@heroui/theme';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { BadgeStatus } from '@/components/atoms/BadgeStatus';
import MyDatatable, {
  MyTableColumnProps,
  MyTableRowProps,
} from '@/components/atoms/Datatable';
import MyDropdown from '@/components/atoms/Dropdown';
import { ArrowDown, SearchIcon, SettingIcon } from '@/components/atoms/icons';
import InputSearch from '@/components/atoms/InputSearch';
import { StripContent } from '@/components/molecules/strip-content';
import OrderActionTable from '@/components/organisms/foodly-apps/group-detail/order-action';
import { ORDER_STATUS_ENUM } from '@/config/constant';
import { useGetOrderListQuery } from '@/hooks/api/apps/foodly/order';
import { useStateQueryParams } from '@/hooks/query';
import { DateHelper } from '@/shared/helper/date';
import { calculateNo, commaFormat } from '@/shared/helper/format';
import StatusHelper from '@/shared/helper/status';

export type OrderListClass = {
  groupId?: string;
  className: string;
};

export default function OrderListTable({ className, groupId }: OrderListClass) {
  const t = useTranslations();
  const { lang } = useParams();

  StatusHelper.setTranslation(t);
  const statusOptions = StatusHelper.getStatusOptions();

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'no',
    'name',
    'menu_name',
    'quantity',
    'price',
    'total',
    'note',
    'status',
    'action',
  ]);

  const [searchParams, , setSpecificValue] = useStateQueryParams({
    group_id: groupId,
    page: 1,
    size: 10,
    sort: 'created_at:desc',
    keyword: '',
    with_created_by: 1,
    with_group: 1,
    statuses: Object.values(ORDER_STATUS_ENUM).map((status) =>
      status.toString(),
    ),
  });

  const { data: orderList, isPending } = useGetOrderListQuery(
    { ...searchParams, group_id: groupId },
    !!groupId,
  );

  // Define columns for the datatable
  const columns: MyTableColumnProps[] = [
    {
      key: 'no',
      label: t('table.columns.no'),
      props: {},
      show: true,
    },
    {
      key: 'name',
      label: t('table.columns.user.display_name'),
      props: {},
      show: true,
    },
    {
      key: 'menu_name',
      label: t('table.columns.menu_name'),
      props: {},
      show: true,
    },
    {
      key: 'quantity',
      label: t('table.columns.quantity'),
      props: {},
      show: true,
    },
    {
      key: 'price',
      label: t('table.columns.price'),
      props: {},
      show: true,
    },
    {
      key: 'total',
      label: t('table.columns.total'),
      props: {},
      show: true,
    },
    {
      key: 'note',
      label: t('table.columns.note'),
      props: {},
      show: true,
    },
    {
      key: 'payment_method',
      label: t('table.columns.payment_method'),
      props: {},
      show: true,
    },
    {
      key: 'status',
      label: t('table.columns.status'),
      props: {},
      show: true,
    },
    {
      key: 'created_at',
      label: t('table.columns.created_at'),
      props: {},
      show: true,
    },
    {
      key: 'action',
      label: t('table.columns.action'),
      props: {},
      show: true,
    },
  ];

  const rows: MyTableRowProps[] =
    orderList?.orders.map((order, index) => {
      return {
        key: order.id,
        no: {
          render: calculateNo(
            index,
            orderList?.meta?.current_page,
            searchParams.size,
          ),
        },
        name: {
          render: (
            <StripContent
              content={order.created_by.display_name}
              maxContentLength={50}
            />
          ),
        },
        menu_name: {
          render: (
            <StripContent
              content={order.menu.map((i) => i.name).join(', ')}
              maxContentLength={50}
            />
          ),
        },
        quantity: {
          render: order.quantity,
        },
        price: {
          render: commaFormat(Number(order.price)),
        },
        total: {
          render: commaFormat(Number(order.amount)),
        },
        note: {
          render: <StripContent content={order.note} maxContentLength={50} />,
        },
        payment_method: {
          render: (
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-primary border border-primary bg-primary-50">
              {order.payment_method?.toUpperCase()}
            </span>
          ),
        },
        status: {
          render: <BadgeStatus status={order.status} />,
        },
        created_at: {
          render: DateHelper.prettyDatetime(order.created_at, lang as string),
        },
        action: {
          render: <OrderActionTable order={order} />,
        },
      };
    }) ?? [];

  const columnsOptions = columns.map((column) => ({
    uid: column.key,
    name: column.label as string,
  }));

  const handleStatusChange = (keys: string[]) => {
    setSpecificValue('statuses', keys);
  };

  const setCurrentPage = (page: number) => {
    setSpecificValue('page', page);
  };

  return (
    <div className={cn('rounded-xl bg-white p-4', className)}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex flex-row gap-2 justify-between items-center">
          <InputSearch
            classNames={{
              mainWrapper:
                'md:min-w-[320px] md:max-w-[440px] xss:min-w-full xs:max-w-full sm:min-w-[320px] sm:max-w-full',
              input: 'placeholder:text-gray-500',
              inputWrapper: 'rounded-[32px] border border-gray-100',
            }}
            size="lg"
            startContent={<SearchIcon className="h-6 w-6 text-gray-500 mr-2" />}
            onChangeDebounce={(value) => setSpecificValue('keyword', value)}
          />
          <MyDropdown
            columns={statusOptions}
            dropdownMenuProps={{
              selectedKeys: searchParams.statuses,
              onSelectionChange: handleStatusChange,
            }}
            myButtonProps={{
              className: 'min-w-[150px] text-md',
              endContent: <ArrowDown className="h-4 w-4 text-gray-500" />,
              color: 'default',
              size: 'md',
            }}
            triggerContent={t('common.status.label').toLowerCase()}
          />
        </div>
        <MyDropdown
          columns={columnsOptions}
          dropdownMenuProps={{
            selectedKeys: selectedColumns,
            onSelectionChange: setSelectedColumns,
          }}
          myButtonProps={{
            className: 'min-w-[150px] text-md',
            startContent: <SettingIcon className="h-5 w-5 text-gray-500" />,
            color: 'default',
            size: 'md',
          }}
          triggerContent={t('common.table_column.label').toLowerCase()}
        />
      </div>
      <div className="mb-2">
        {orderList?.total_quantity !== undefined &&
          orderList?.total_quantity > 0 && (
            <p className="text-medium text-primary">
              {t('common.order_table.total', {
                total: commaFormat(Number(orderList?.total_quantity ?? 0)),
                amount:
                  commaFormat(Number(orderList?.total_amount ?? 0)) + ' VND',
              })}
            </p>
          )}
      </div>
      <div className="flex flex-col">
        <MyDatatable
          className="max-h-[700px]"
          columns={columns}
          defaultColumnVisibility={selectedColumns}
          isLoading={isPending}
          rows={rows}
          title="Order List"
        />
      </div>
      <div className="flex flex-col mt-4">
        <Pagination
          isCompact
          showControls
          page={orderList?.meta?.current_page}
          total={orderList?.meta?.page_count ?? 1}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
