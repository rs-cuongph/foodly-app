import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  ResetPasswordPayload,
  ResetPasswordResponse,
  SetFirstPasswordPayload,
  SetFirstPasswordResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
  UpdateFirstPasswordPayload,
  UpdateFirstPasswordResponse,
  UpdatePasswordPayload,
  UpdatePasswordResponse,
  UpdateUserInfoPayload,
  UpdateUserInfoResponse,
  UserInfoResponse,
  VerifyResetPasswordResponse,
  WebAuthnVerifyAuthenticationDTO,
  WebAuthnVerifyRegistrationDTO,
} from './type';

import { STORAGE_KEYS } from '@/config/constant';
import { siteConfig } from '@/config/site';
import { apiClient } from '@/plugins/axios';
export const signIn = async (
  userData: SignInPayload,
): Promise<SignInResponse> => {
  const { data } = await apiClient.post<SignInResponse>(
    siteConfig.apps.apiRoutes.login,
    userData,
  );

  return data;
};

const signUp = async (userData: SignUpPayload): Promise<SignUpResponse> => {
  const { data } = await apiClient.post<SignUpResponse>(
    siteConfig.apps.apiRoutes.register,
    userData,
  );

  return data;
};

const getUserInfo = async (): Promise<UserInfoResponse> => {
  const { data } = await apiClient.get<UserInfoResponse>(
    siteConfig.apps.apiRoutes.my_info,
  );

  return data;
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (data: SignUpPayload) => signUp(data),
  });
};

export const useGetUserInfoQuery = (
  id: string,
  accessToken: string,
  pathName?: string,
) => {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken || '');
  }

  return useQuery({
    queryKey: ['get-user-info', id, pathName],
    queryFn: getUserInfo,
    enabled: !!id && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const getWebAuthnChallenge = async () => {
  const { data } = await apiClient.post<string>(
    siteConfig.apps.apiRoutes.webauthn.generate_challenge,
  );

  return data;
};

export const verifyWebAuthnRegistration = async ({
  challenge,
  response,
}: WebAuthnVerifyRegistrationDTO) => {
  const { data } = await apiClient.post<RegistrationInfo>(
    siteConfig.apps.apiRoutes.webauthn.verify_registration,
    {
      challenge,
      registration: response,
    },
  );

  return data;
};

export const verifyWebAuthnAuthentication = async ({
  challenge,
  response,
}: WebAuthnVerifyAuthenticationDTO) => {
  const { data } = await apiClient.post<SignInResponse>(
    siteConfig.apps.apiRoutes.webauthn.verify_authentication,
    {
      challenge,
      authentication: response,
    },
  );

  return data;
};

const updateUserInfo = async (payload: UpdateUserInfoPayload) => {
  const { data } = await apiClient.put<UpdateUserInfoResponse>(
    siteConfig.apps.apiRoutes.update_user_info,
    payload,
  );

  return data;
};

export const useUpdateUserInfoMutation = () => {
  return useMutation({
    mutationKey: ['update-user-info'],
    mutationFn: (payload: UpdateUserInfoPayload) => updateUserInfo(payload),
  });
};

const updatePassword = async (payload: UpdatePasswordPayload) => {
  const { data } = await apiClient.put<UpdatePasswordResponse>(
    siteConfig.apps.apiRoutes.update_password,
    payload,
  );

  return data;
};

const updateFirstPassword = async (payload: UpdateFirstPasswordPayload) => {
  const { data } = await apiClient.put<UpdateFirstPasswordResponse>(
    siteConfig.apps.apiRoutes.update_first_password,
    payload,
  );

  return data;
};

export const useUpdateFirstPasswordMutation = () => {
  return useMutation({
    mutationKey: ['update-first-password'],
    mutationFn: (payload: UpdateFirstPasswordPayload) =>
      updateFirstPassword(payload),
  });
};

export const useUpdatePasswordMutation = () => {
  return useMutation({
    mutationKey: ['update-password'],
    mutationFn: (payload: UpdatePasswordPayload) => updatePassword(payload),
  });
};

const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await apiClient.put<ResetPasswordResponse>(
    siteConfig.apps.apiRoutes.reset_password,
    payload,
  );

  return data;
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
};

export const verifyResetPasswordApi = async (token: string) => {
  const { data } = await apiClient.get<VerifyResetPasswordResponse>(
    siteConfig.apps.apiRoutes.verify_reset_password,
    {
      params: {
        token,
      },
    },
  );

  return data;
};

export const useVerifyResetPasswordQuery = (token: string) => {
  return useQuery({
    queryKey: ['verify-reset-password', token],
    queryFn: () => verifyResetPasswordApi(token),
  });
};

const setFirstPassword = async (payload: SetFirstPasswordPayload) => {
  const { data } = await apiClient.put<SetFirstPasswordResponse>(
    siteConfig.apps.apiRoutes.set_first_password,
    payload,
  );

  return data;
};

export const useSetFirstPasswordMutation = () => {
  return useMutation({
    mutationKey: ['set-first-password'],
    mutationFn: (payload: SetFirstPasswordPayload) => setFirstPassword(payload),
  });
};
