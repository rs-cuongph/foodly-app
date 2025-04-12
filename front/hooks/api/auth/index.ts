import { RegistrationInfo } from '@passwordless-id/webauthn/dist/esm/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  SignUpResponse,
  UserInfoResponse,
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
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken || '');

  return useQuery({
    queryKey: ['get-user-info', id],
    queryFn: getUserInfo,
    enabled: !!id,
  });
};

export const getWebAuthnChallenge = async () => {
  const { data } = await apiClient.post<string>(
    siteConfig.apiRoutes.webauthn.generate_challenge,
  );

  return data;
};

export const verifyWebAuthnRegistration = async ({
  challenge,
  response,
}: WebAuthnVerifyRegistrationDTO) => {
  const { data } = await apiClient.post<RegistrationInfo>(
    siteConfig.apiRoutes.webauthn.verify_registration,
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
    siteConfig.apiRoutes.webauthn.verify_authentication,
    {
      challenge,
      authentication: response,
    },
  );

  return data;
};
