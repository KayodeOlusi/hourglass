import Endpoints from '@/services/endpoints';
import HttpClient from '@/services/http';
import type {
  ApiResponse,
  AuthProvider,
  NonceResponse,
  SignInBody,
  SignInResponse,
} from '@/services/types';

const AuthRequests = {
  getNonce: () => HttpClient.post<NonceResponse>(Endpoints.auth.nonce),
  signIn: (provider: AuthProvider, body: SignInBody) =>
    HttpClient.post<SignInResponse>(Endpoints.auth.signIn(provider), body),
  logout: () => HttpClient.post<ApiResponse>(Endpoints.auth.logout),
  logoutAll: () => HttpClient.post<ApiResponse>(Endpoints.auth.logoutAll),
};

export { AuthRequests };
