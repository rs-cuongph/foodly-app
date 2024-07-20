export enum SORT_TYPE {
  'DESC' = 'DESC',
  'ASC' = 'ASC',
}

export enum SEARCH_BY {
  ROOM = 'room',
  ORDER = 'order',
}

export type FindAllResponse<T> = {
  count: number;
  items: T[];
  summary?: any;
  bill?: any;
};

export type SortParams = { sort_by: string; sort_type: SORT_TYPE };

export type SearchParams = { keywork: string; field: string };

export type PaginateParams = { page: number; page_size: number };
