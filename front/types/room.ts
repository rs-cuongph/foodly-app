export interface ListParamsI {
  page?: number;
  page_size?: number;
}

export interface ListUserParamsI {
  page?: number;
  page_size?: number;
}

interface PaymentSetting {
  account_name: string;
  account_number: string;
  id: string;
  method: string;
}

interface Creator {
  email: string;
  role: string;
  id: string;
  username: string;
  payment_setting: PaymentSetting[];
}

export interface Room {
  deleted_at: string | null;
  room_id: string;
  name: string;
  description: string;
  creator: Creator;
  invited_people: string[];
  total_item: number;
  public_time_start: string;
  public_time_end: string;
  price: number;
  share_scope: string;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface ListRoomResponseI {
  data: Room[];
  pagination: {
    page: number;
    total_record: number;
  };
}

export interface ListUserI {
  count: number;
  items: {
    deleted_at: string | null;
    email: string;
    username: string;
    role: "USER" | "ADMIN";
    block_to: string | null;
    created_at: string;
    updated_at: string;
    id: string;
    full_name: string;
  }[];
}

export interface SearchParamsI {
  page?: number;
  page_size?: number;
  keywords?: string;
}
