export const pageSizeDefault = 3;
export const pageDefault = 1;

export function paginate<T>(
  page: number,
  pageSize: number,
  totalCount: number,
  items: T[],
): {
  totalCount: number;
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
} {
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = skip + take < totalCount;
  const hasPreviousPage = page > 1;

  return {
    totalCount,
    items,
    page,
    pageSize,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
}
