import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CreateGroupParams, GroupListParams, GroupListResponse } from './type';

import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';

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
