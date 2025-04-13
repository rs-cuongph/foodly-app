import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { OrderListParams, OrderListResponse } from './type';

import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';

const getOrderListByGroupId = async (params: OrderListParams) => {
  const { data } = await apiClient.get<OrderListResponse>(
    siteConfig.apps.foodly.apiRoutes.order.list,
    {
      params,
    },
  );

  return data;
};

export const useGetOrderListQuery = (
  params: OrderListParams,
  enabled: boolean,
) => {
  return useQuery({
    queryFn: () => getOrderListByGroupId(params),
    queryKey: ['order-list', params],
    enabled,
    placeholderData: keepPreviousData,
  });
};
