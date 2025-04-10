import {
  AuthenticationResponseJSON,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types';

export type SignInPayload = {
  email: string;
  password: string;
  organization_code: string;
};

export type SignInResponse = {
  iat: number;
  exp: number;
  type: string;
  user_id: string;
  organization_id: string;
  access_token: string;
  refresh_token: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
  confirm_password: string;
  display_name?: string | null;
  organization_code: string;
};

export type SignUpResponse = {
  iat: number;
  exp: number;
  type: string;
  user_id: string;
  organization_id: string;
  access_token: string;
  refresh_token: string;
};

export type UserInfoResponse = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  block_to: string | null;
  my_coin: string;
  payment_setting: any | null;
  max_order: number;
  organization_id: string;
  reset_password_token: string;
  reset_password_token_expires_at: string;
  login_code: string | null;
  login_code_expires_at: string | null;
  created_at: string;
  updated_at: string;
  can_create_order: boolean;
};

export type WebAuthnVerifyRegistrationDTO = {
  challenge: string;
  response: RegistrationJSON;
};

export type WebAuthnVerifyAuthenticationDTO = {
  challenge: string;
  response: AuthenticationResponseJSON;
};
