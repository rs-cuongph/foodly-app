import { useMutation, useQuery } from '@tanstack/react-query';

import {
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
  UserInfoResponse,
} from './type';

import { LOCAL_STORAGE_KEYS } from '@/config/constant';
import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';
export const signIn = async (
  userData: SignInPayload,
): Promise<SignInResponse> => {
  const { data } = await apiClient.post<SignInResponse>(
    siteConfig.apiRoutes.login,
    userData,
  );

  return data;
};

const signUp = async (userData: SignUpPayload): Promise<SignUpResponse> => {
  const { data } = await apiClient.post<SignUpResponse>(
    siteConfig.apiRoutes.register,
    userData,
    {
      transport: {
        skipValidation: true,
      },
    },
  );

  return data;
};

const getUserInfo = async (): Promise<UserInfoResponse> => {
  const { data } = await apiClient.get<UserInfoResponse>(
    siteConfig.apiRoutes.my_info,
  );

  return data;
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (data: SignUpPayload) => signUp(data),
  });
};

export const useGetUserInfoQuery = (id: string, accessToken: string) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken || '');

  return useQuery({
    queryKey: ['get-user-info', id],
    queryFn: getUserInfo,
    enabled: !!id,
  });
};
