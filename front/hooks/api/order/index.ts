import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  CreateOrderParams,
  CreateOrderResponse,
  OrderListParams,
  OrderListResponse,
} from './type';

import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';
import { formatRoute } from '@/shared/helper/format';

const getOrderListByGroupId = async (params: OrderListParams) => {
  const { data } = await apiClient.get<OrderListResponse>(
    siteConfig.apps.apiRoutes.order.list,
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
  return apiClient.post<CreateOrderResponse>(
    siteConfig.apps.apiRoutes.order.create,
    data,
  );
};

export const markPaidApi = (orderId: string) => {
  return apiClient.patch(
    formatRoute(siteConfig.apps.apiRoutes.order.mark_paid, {
      id: orderId,
    }),
  );
};

export const cancelApi = (orderId: string, reason: string) => {
  return apiClient.put(
    formatRoute(siteConfig.apps.apiRoutes.order.cancel, {
      id: orderId,
    }),
    {
      reason,
    },
  );
};

export const confirmPaidApi = (orderId: string) => {
  return apiClient.patch(
    formatRoute(siteConfig.apps.apiRoutes.order.confirm_paid, {
      id: orderId,
    }),
  );
};

export const markPaidAllApi = (includeIds: string[], excludeIds: string[]) => {
  return apiClient.patch(siteConfig.apps.apiRoutes.order.mark_paid_all, {
    include_ids: includeIds,
    exclude_ids: excludeIds,
  });
};

export const confirmPaidAllApi = (
  includeIds: string[],
  excludeIds: string[],
) => {
  return apiClient.patch(siteConfig.apps.apiRoutes.order.confirm_paid_all, {
    include_ids: includeIds,
    exclude_ids: excludeIds,
  });
};

export const useCancelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useMarkPaidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markPaidApi(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const useConfirmPaidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => confirmPaidApi(orderId),
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

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { orderId: string; reason: string }) =>
      cancelApi(data.orderId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};
