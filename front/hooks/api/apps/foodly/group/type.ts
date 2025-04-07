import { MetaResponse } from '@/hooks/api/type';

type GroupListItem = {
  id: string;
  code: string;
  name: string;
  created_by_id: string;
  public_start_time: string;
  public_end_time: string;
  price: string;
  share_scope: string;
  type: string;
  status: string;
  organization_id: string;
  invite_code: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: {
    id: string;
    display_name: string;
  };
  menu_items: {
    id: string;
    name: string;
    price: string;
  }[];
  order_count: number;
  total_quantity: number;
};

export type GroupListResponse = {
  groups: GroupListItem[];
  meta: MetaResponse;
};

export type GroupListParams = {
  page: number;
  size: number;
  keyword: string;
  // status: string[];
  // share_scope: string[];
  sort: string;
  is_online: number;
  is_mine: number;
};
