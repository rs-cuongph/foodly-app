export const ROUTES = {
  HOME: "/home",
  PAYMENT: "/payment",
  GROUPS: "/groups",
  MY_PAGE: "/my-page",
};

export const PAGINATION_PARAMS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 50,
};

export enum SHARE_SCOPE {
  PUBLIC = "public",
  LIMIT = "limit",
}

export const PAYMENT_METHODS = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "vietcombank",
    label: "Vietcombank",
  },
  {
    value: "vpbank",
    label: "VP Bank",
  },
];

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  AUTHENTICATION: "AUTHENTICATION",
  REFRESH_TOKEN: "REFRESH_TOKEN",
};

export const DETAIL_ORDER_DROPDOWN_ITEMS = [
  {
    label: "Khóa",
    icon: "lock",
  },
  {
    label: "Chỉnh Sửa",
    icon: "edit",
  },
  {
    label: "Chia sẻ",
    icon: "share",
  },
  {
    label: "Xóa",
    icon: "delete",
  },
];

