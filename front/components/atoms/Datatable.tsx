import {
  SlotsToClasses,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { isNil } from 'lodash';
import { useTranslations } from 'next-intl';
import { forwardRef, ReactNode } from 'react';

import { FoodLoading } from './FoodLoading';

export type MyTableColumnProps = {
  key: string;
  label: string | ReactNode;
  props?: {
    allowsResizing?: boolean;
    allowsSorting?: boolean;
  };
  show?: boolean;
};

export type MyTableRenderProps = {
  render: string | ReactNode | ((obj: MyTableRowProps) => ReactNode);
};

export type MyTableRowProps = {
  key: string;
  [key: string]:
    | MyTableRenderProps
    | string
    | number
    | boolean
    | undefined
    | null;
};

type MyDatatableProps = {
  title: string;
  defaultColumnVisibility?: string[];
  columns: MyTableColumnProps[];
  isLoading?: boolean;
  loadingContent?: ReactNode;
  rows: MyTableRowProps[] | [];
  className?: string;
  classNames?: SlotsToClasses<
    | 'table'
    | 'base'
    | 'tbody'
    | 'td'
    | 'tfoot'
    | 'th'
    | 'thead'
    | 'tr'
    | 'wrapper'
    | 'sortIcon'
    | 'emptyWrapper'
    | 'loadingWrapper'
  >;
  maxTableHeight?: number;
};

export const MyDatatable = forwardRef<HTMLElement, MyDatatableProps>(
  (props, ref) => {
    const {
      title,
      columns,
      rows,
      isLoading = false,
      loadingContent = <FoodLoading />,
      className,
      classNames,
      defaultColumnVisibility,
      maxTableHeight,
    } = props;
    const t = useTranslations();

    const filterColumn = (columns: MyTableColumnProps[]) => {
      return columns.filter(
        (column) =>
          column.show !== false &&
          defaultColumnVisibility?.includes(column.key),
      );
    };

    const filterRow = (rows: MyTableRowProps[]) => {
      return rows.filter(Boolean);
    };

    return (
      <Table
        ref={ref}
        isHeaderSticky
        isVirtualized
        aria-label={title}
        className={className}
        classNames={classNames}
        maxTableHeight={maxTableHeight || 600}
      >
        <TableHeader>
          {filterColumn(columns).map((column) => (
            <TableColumn
              key={column.key}
              className="capitalize"
              {...column.props}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={t('common.empty')}
          isLoading={isLoading}
          items={filterRow(rows)}
          loadingContent={loadingContent}
        >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => {
                const obj = item[columnKey] as MyTableRenderProps;
                const render = obj.render;

                if (isNil(render)) return <></>;
                let children = '' as any;

                if (typeof render == 'function') children = render(item);
                else children = render;

                return <TableCell>{children}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  },
);

MyDatatable.displayName = 'MyDatatable';

export default MyDatatable;
