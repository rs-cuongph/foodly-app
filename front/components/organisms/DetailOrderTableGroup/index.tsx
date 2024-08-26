import React, { useMemo, useCallback } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Button, Chip} from "@nextui-org/react";
import CustomIcon from "@/components/atoms/CustomIcon";
import { STATUS } from "@/shared/constants";

export const DetailOrderTableGroup = () => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const orders = [
    {
      key: "1",
      no: 1,
      name: "NhaTQ",
      dish: "Cơm Chay",
      quantity: 2,
      price: 25000,
      note: "Tầng 3",
      bank: "VIB",
      status: "doing",
    },
    {
      key: "2",
      no: 2,
      name: "NhaTQ",
      dish: "Cơm Chay",
      quantity: 2,
      price: 25000,
      note: "Tầng 3",
      bank: "VIB",
      status: "success",
    },
    {
      key: "3",
      no: 3,
      name: "NhaTQ",
      dish: "Cơm Chay",
      quantity: 2,
      price: 25000,
      note: "Tầng 3",
      bank: "VIB",
      status: "open",
    },
    {
      key: "4",
      no: 4,
      name: "NhaTQ",
      dish: "Cơm Chay",
      quantity: 2,
      price: 25000,
      note: "Tầng 3",
      bank: "VIB",
      status: "cancel",
    },
  ];

  const dataTable = useMemo(() => {
    return orders.map((item) => ({
      ...item,
      price: item.price.toLocaleString(),
      price_total: (item.price * item.quantity).toLocaleString(),
    }))
  }, [orders]);

  const pages = Math.ceil(dataTable.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return dataTable.slice(start, end);
  }, [page, orders]);

  const columns = [
    {name: "STT", uid: "no"},
    {name: "Name", uid: "name"},
    {name: "Món", uid: "dish"},
    {name: "SL", uid: "quantity"},
    {name: "Giá", uid: "price"},
    {name: "Thành tiền", uid: "price_total"},
    {name: "Ghi chú", uid: "note"},
    {name: "PTTT", uid: "bank"},
    {name: "Trạng Thái", uid: "status"},
    {name: "", uid: "actions"},
  ];

  const renderCell = useCallback((data: any, columnKey: any) => {
    const cellValue = data[columnKey as any];

    switch (columnKey) {
      case "bank":
        return (
          <Chip className="text-coral-orange bg-coral-orange-40 border border-coral-orange min-w-[63px] text-center text-xs font-medium">{cellValue}</Chip>  
        );
      case "status":
        const statusInfo = STATUS[cellValue as keyof typeof STATUS];
        return  (
          <Chip color={statusInfo.color  as "success" | "primary" | "warning" | "danger"} className="text-white" classNames={{
            base: `${cellValue === "open" && "!bg-primary-default"}`,
          }}>
            {statusInfo.label}
          </Chip>)
      case "actions":
        if (data.status === "cancel") return "";
        return (
          <Button isIconOnly variant="light" aria-label="Like">
            <CustomIcon name={data.status === "open" ? "qrcode-scan" : "copy-link"}/>
          </Button>   
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <div className="mb-3 text-xs text-coral-orange font-medium">
        Tổng: {items.length} phần - {(items.length * 25000).toLocaleString()} vnđ
      </div>
      <Table 
        classNames={{
          wrapper: "min-h-[234px] py-3 px-4 !rounded-lg",
          th: "bg-white text-coral-orange text-sm",
          thead: "border-b border-translucent-black",
        }}
      >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "status" ? "start" : "center"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
      </Table>
      <div className="flex w-full mt-3">
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
          classNames={{
            wrapper: "border border-light-gray",
            next: "text-coral-orange",
            prev: "text-coral-orange",
          }}
        />
      </div>
    </div>
  );
}
