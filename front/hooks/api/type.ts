export type MetaResponse = {
  is_first_page: boolean;
  is_last_page: boolean;
  current_page: number;
  previous_page: number | null;
  next_page: number | null;
  page_count: number;
  total_count: number;
};
