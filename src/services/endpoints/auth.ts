import type { AuthProvider } from '@/services/types';

const AuthEndpoints = {
  nonce: '/auth/nonce',
  signIn: (provider: AuthProvider) => `/auth/oauth/${provider}`,
  refresh: '/auth/refresh',
  logout: '/auth/logout',
  logoutAll: '/auth/logout-all',
};

export { AuthEndpoints };
