import type { ApiResponse } from './api';
import type { User } from './user';

type AuthProvider = 'google' | 'apple';

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

type Device = {
  platform: 'ios' | 'android';
  installation_id: string;
  device_token?: string;
  device_name?: string;
  app_version?: string;
  os_version?: string;
};

type SignInBody = {
  id_token: string;
  nonce: string;
  first_name?: string;
  last_name?: string;
  device: Device;
};

type NonceResponse = ApiResponse<{ nonce: string }>;
type SignInResponse = ApiResponse<User> & AuthTokens;
type RefreshResponse = ApiResponse & AuthTokens;

export type { AuthProvider, AuthTokens, Device, SignInBody, NonceResponse, SignInResponse, RefreshResponse };
