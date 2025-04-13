export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  ORGANIZATION_CODE: 'ORGANIZATION_CODE',
  GROUP_INVITE_CODE: 'GROUP_INVITE_CODE',
};

export enum SHARE_SCOPE_ENUM {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum GROUP_TYPE_ENUM {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

export enum GROUP_STATUS_ENUM {
  INIT = 'INIT',
  LOCKED = 'LOCKED',
  AVAILABLE = '1',
  UNAVAILABLE = '0',
}

export enum ORDER_STATUS_ENUM {
  INIT = 'INIT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
