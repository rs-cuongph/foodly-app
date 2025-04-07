import { useQuery } from '@tanstack/react-query';

import { GroupListParams, GroupListResponse } from './type';

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

export const useGetGroupListQuery = (params: GroupListParams) => {
  return useQuery({
    queryKey: ['group-list', params],
    queryFn: () => getGroupListApi(params),
    enabled: !!params.page && !!params.size,
  });
};
