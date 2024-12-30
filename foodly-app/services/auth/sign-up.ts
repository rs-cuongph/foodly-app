import { siteConfig } from "@/config/site";
import { apiClient } from "@/plugins/axios";

export type SignUpPayload = {
  email: string;
  password: string;
  confirm_password: string;
  display_name?: string | null;
  organization_id?: string;
};

export interface SignUpResponse {
  iat: number;
  exp: number;
  type: string;
  user_id: number;
  organization_id?: string;
  access_token: string;
  refresh_token: string;
}

export function SignUpAPI(data: SignUpPayload): Promise<SignUpResponse> {
  return apiClient.post(siteConfig.apiRoutes.register, data);
}
