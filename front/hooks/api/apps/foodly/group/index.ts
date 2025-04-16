import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreateGroupParams,
  GroupDetailResponse,
  GroupListParams,
  GroupListResponse,
  UpdateGroupParams,
} from './type';

import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';
import { formatRoute } from '@/shared/helper/format';

const getGroupListApi = async (params: GroupListParams) => {
  const { data } = await apiClient.get<GroupListResponse>(
    siteConfig.apps.foodly.apiRoutes.group.list,
    {
      params,
    },
  );

  return data;
};

const createGroupApi = async (data: CreateGroupParams) => {
  const { data: res } = await apiClient.post(
    siteConfig.apps.foodly.apiRoutes.group.create,
    data,
  );

  return res;
};

export const useGetGroupListQuery = (params: GroupListParams) => {
  return useQuery({
    queryKey: ['group-list', params],
    queryFn: () => getGroupListApi(params),
    enabled: !!params.page && !!params.size,
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupParams) => createGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-list'] });
    },
  });
};

export const updateGroupApi = async (data: UpdateGroupParams) => {
  const { data: res } = await apiClient.put(
    formatRoute(siteConfig.apps.foodly.apiRoutes.group.update, { id: data.id }),
    data,
  );

  return res;
};

export const useUpdateGroupMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupParams) => updateGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', id] });
      queryClient.invalidateQueries({ queryKey: ['order-list'] });
    },
  });
};

export const checkGroupApi = async (id: string) => {
  const { data } = await apiClient.get<{
    canAccess: boolean;
  }>(formatRoute(siteConfig.apps.foodly.apiRoutes.group.check, { id }));

  return data;
};

export const getGroupApi = async (
  id: string,
  params: { invite_code: string },
) => {
  const { data } = await apiClient.get<GroupDetailResponse>(
    formatRoute(siteConfig.apps.foodly.apiRoutes.group.detail, { id }),
    {
      params,
    },
  );

  return data;
};

export const useGetGroupQuery = (
  id: string,
  params: { invite_code: string },
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupApi(id, params),
    enabled,
  });
};

export const lockGroupApi = async (id: string, invite_code: string | null) => {
  const { data } = await apiClient.put(
    formatRoute(siteConfig.apps.foodly.apiRoutes.group.lock, { id }),
    {},
    {
      params: { invite_code },
    },
  );

  return data;
};

export const deleteGroupApi = async (
  id: string,
  invite_code: string | null,
) => {
  const { data } = await apiClient.delete(
    formatRoute(siteConfig.apps.foodly.apiRoutes.group.delete, { id }),
    {
      params: { invite_code: invite_code },
    },
  );

  return data;
};

export const useLockGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; invite_code: string | null }) =>
      lockGroupApi(data.id, data.invite_code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['group', data.id] });
    },
  });
};

export const useDeleteGroupMutation = () => {
  return useMutation({
    mutationFn: (data: { id: string; invite_code: string | null }) =>
      deleteGroupApi(data.id, data.invite_code),
  });
};
