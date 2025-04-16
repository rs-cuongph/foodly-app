import {
  GROUP_STATUS_ENUM,
  GROUP_TYPE_ENUM,
  SHARE_SCOPE_ENUM,
} from '@/config/constant';
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
  status: string[];
  share_scope: string[];
  sort: string;
  is_online: string;
  is_mine: number;
};

export type CreateGroupParams = {
  name: string;
  public_start_time: string;
  public_end_time: string | null;
  share_scope: string;
  type: string;
  price: number;
  is_save_template: boolean;
  menu_items: {
    name: string;
    price: number;
  }[];
};

export type GroupDetailResponse = {
  id: string;
  code: string;
  name: string;
  created_by_id: string;
  public_start_time: string;
  public_end_time: string;
  price: string;
  share_scope: SHARE_SCOPE_ENUM;
  type: GROUP_TYPE_ENUM;
  status: GROUP_STATUS_ENUM;
  organization_id: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  menu_items: Array<{
    id: string;
    name: string;
    price: string;
    group_id: string;
    deleted_at: null | string;
    created_at: string;
    updated_at: string;
  }>;
  created_by: {
    id: string;
    display_name: string;
    payment_setting: Array<{
      account_name: string;
      account_number: string;
      payment_method: string;
    }>;
  };
  is_same_price: boolean;
  price_range: any[];
  order_count: number;
  total_quantity: number;
};

type UpdateMenu =
  | {
      id?: string;
      name: string;
      price: number;
      _destroy?: boolean;
    }
  | {
      id: string;
      _destroy: boolean;
    };

export type UpdateGroupParams = {
  id: string;
  name: string;
  public_start_time: string;
  public_end_time: string | null;
  share_scope: string;
  type: string;
  price: number;
  is_save_template: boolean;
  menu_items: UpdateMenu[];
  invite_code: string | null;
};
