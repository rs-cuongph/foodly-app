import { MetaResponse } from '@/hooks/api/type';
export type OrderListParams = {
  page: number;
  size: number;
  sort: string;
  keyword: string;
  statuses?: string[];
  is_mine?: number;
  with_group?: number;
  group_id?: string;
  with_created_by?: number;
};

export type OrderListItem = {
  id: string;
  quantity: number;
  status: string;
  payment_method: string;
  price: string;
  amount: string;
  menu: Array<{
    id: string;
    name: string;
    price: number;
    group_id: string;
    created_at: string;
    deleted_at: null | string;
    updated_at: string;
  }>;
  group_id: string;
  note: string;
  created_by_id: string;
  updated_by_id: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  transaction_id: string;
  group: {
    id: string;
    name: string;
    code: string;
    share_scope: string;
    type: string;
    price: string;
    status: string;
    created_by: {
      id: string;
      email: string;
      display_name: string;
    };
  };
  transaction: {
    unique_code: string;
  };
  created_by: {
    id: string;
    email: string;
    display_name: string;
  };
};

export type OrderListResponse = {
  orders: OrderListItem[];
  meta: MetaResponse;
  total_quantity: number;
  total_amount: number;
};

export type CreateOrderParams = {
  group_id: string;
  quantity: number;
  note: string;
  payment_method: {
    account_name: string;
    account_number: string;
    payment_method: string;
  }[];
  menu: {
    id: string;
  }[];
};
