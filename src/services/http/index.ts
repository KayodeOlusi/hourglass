import { AxiosError, create, InternalAxiosRequestConfig, isAxiosError } from 'axios';

import Endpoints from '@/services/endpoints';
import type { RefreshResponse } from '@/services/types';
import { useSession } from '@/store/session';

type Params = Record<string, string | number | boolean>;
type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const instance = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Every request carries the access token when there is one, so callers never pass it.
instance.interceptors.request.use((config) => {
  const token = useSession.getState().accessToken;
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The server rotates refresh tokens (the old one dies on use), so concurrent 401s must share one
// refresh. Returns the new access token, or null if the refresh failed.
let refreshing: Promise<string | null> | null = null;

function refreshSession() {
  refreshing ??= (async () => {
    const session = useSession.getState();
    try {
      if (!session.refreshToken) throw new Error('No refresh token');
      const { data } = await instance.post<RefreshResponse>(
        Endpoints.auth.refresh,
        { refresh_token: session.refreshToken },
        { _retried: true } as RetryConfig,
      );
      await session.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch (error) {
      // Only a rejected refresh token ends the session; a network blip shouldn't sign the user out.
      const status = (error as AxiosError).response?.status;
      if (!session.refreshToken || status === 401 || status === 403) await session.clear();
      return null;
    }
  })().finally(() => (refreshing = null));
  return refreshing;
}

// On a 401, refresh once and replay the request with the new token.
instance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined;
  if (error.response?.status !== 401 || !config || config._retried || !useSession.getState().refreshToken) {
    throw error;
  }
  config._retried = true;
  const token = await refreshSession();
  if (!token) throw error;
  config.headers.Authorization = `Bearer ${token}`;
  return instance(config);
});

// Thin typed wrapper: each method resolves to the response body.
const HttpClient = {
  async get<T>(endpoint: string, params?: Params) {
    return (await instance.get<T>(endpoint, { params })).data;
  },
  async post<T>(endpoint: string, body?: unknown) {
    return (await instance.post<T>(endpoint, body)).data;
  },
  async put<T>(endpoint: string, body?: unknown) {
    return (await instance.put<T>(endpoint, body)).data;
  },
  async patch<T>(endpoint: string, body?: unknown) {
    return (await instance.patch<T>(endpoint, body)).data;
  },
  async delete<T>(endpoint: string) {
    return (await instance.delete<T>(endpoint)).data;
  },
};

// A message fit to show the user: the server's own message when it sent one.
function errorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (!error.response) return "Can't reach Hourglass. Check your connection and try again.";
  }
  return 'Something went wrong. Please try again.';
}

export default HttpClient;
export { errorMessage };
