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
  count_init_order: number;
  count_processing_order: number;
  empty_password: boolean;
};

export type WebAuthnVerifyRegistrationDTO = {
  challenge: string;
  response: RegistrationJSON;
};

export type WebAuthnVerifyAuthenticationDTO = {
  challenge: string;
  response: AuthenticationResponseJSON;
};

export type PaymentSetting = {
  payment_method: string;
  account_number: string;
  account_name: string;
};

export type UpdateUserInfoPayload = {
  payment_setting?: PaymentSetting[];
  display_name?: string;
};

export type UpdateUserInfoResponse = {
  id: string;
  email: string;
  display_name: string;
  role: string;
};

export type UpdatePasswordPayload = {
  password: string;
  new_password: string;
};

export type UpdateFirstPasswordPayload = {
  new_password: string;
};

export type UpdateFirstPasswordResponse = {
  id: string;
};

export type UpdatePasswordResponse = {
  id: string;
  email: string;
  display_name: string;
  role: string;
};

export type ResetPasswordPayload = {
  organization_code: string;
  email: string;
  redirect_url: string;
};

export type ResetPasswordResponse = {
  id: string;
};

export type VerifyResetPasswordResponse = {
  id: string;
};

export type SetFirstPasswordPayload = {
  token: string;
  new_password: string;
};

export type SetFirstPasswordResponse = {
  id: string;
};

export type RequestSignInByCodePayload = {
  email: string;
  organization_code: string;
};

export type RequestSignInByCodeResponse = {
  message: string;
};

export type VerifySignInByCodePayload = {
  email: string;
  organization_code: string;
  code: string;
};

export type VerifySignInByCodeResponse = {
  iat: number;
  exp: number;
  type: string;
  user_id: string;
  organization_id: string;
  access_token: string;
  refresh_token: string;
};

export type ResendSignInByCodePayload = {
  email: string;
  organization_code: string;
};

export type ResendSignInByCodeResponse = {
  id: string;
};
