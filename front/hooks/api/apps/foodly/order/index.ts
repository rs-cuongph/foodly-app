import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { CreateOrderParams, OrderListParams, OrderListResponse } from './type';

import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';
import { formatRoute } from '@/shared/helper/format';

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

export const createOrderApi = (data: CreateOrderParams) => {
  return apiClient.post(siteConfig.apps.foodly.apiRoutes.order.create, data);
};

export const markPaidApi = (orderId: number) => {
  return apiClient.patch(
    formatRoute(siteConfig.apps.foodly.apiRoutes.order.mark_paid, {
      order_id: orderId,
    }),
  );
};

export const cancelApi = (orderId: number) => {
  return apiClient.delete(
    formatRoute(siteConfig.apps.foodly.apiRoutes.order.cancel, {
      order_id: orderId,
    }),
  );
};

export const confirmPaidApi = (orderId: number) => {
  return apiClient.patch(
    formatRoute(siteConfig.apps.foodly.apiRoutes.order.confirm_paid, {
      order_id: orderId,
    }),
  );
};

export const markPaidAllApi = (includeIds: string[], excludeIds: string[]) => {
  return apiClient.patch(siteConfig.apps.foodly.apiRoutes.order.mark_paid_all, {
    include_ids: includeIds,
    exclude_ids: excludeIds,
  });
};

export const confirmPaidAllApi = (
  includeIds: string[],
  excludeIds: string[],
) => {
  return apiClient.patch(
    siteConfig.apps.foodly.apiRoutes.order.confirm_paid_all,
    {
      include_ids: includeIds,
      exclude_ids: excludeIds,
    },
  );
};

export const useCancelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => cancelApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useMarkPaidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => markPaidApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useConfirmPaidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => confirmPaidApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useMarkPaidAllMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      includeIds,
      excludeIds,
    }: {
      includeIds: string[];
      excludeIds: string[];
    }) => markPaidAllApi(includeIds, excludeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useConfirmPaidAllMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      includeIds,
      excludeIds,
    }: {
      includeIds: string[];
      excludeIds: string[];
    }) => confirmPaidAllApi(includeIds, excludeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderParams) => createOrderApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};
