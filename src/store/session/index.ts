import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { User } from '@/services/types';

const KEYS = { access: 'session.access', refresh: 'session.refresh', user: 'session.user' } as const;

type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type SessionState = {
  status: 'loading' | 'signed-in' | 'signed-out';
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrate: () => Promise<void>;
  setSession: (session: Session) => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clear: () => Promise<void>;
};

// Signed-in user and tokens. Tokens live in the Keychain/Keystore; the store mirrors them in memory
// so the HTTP client (outside React) can read them with useSession.getState().
const useSession = create<SessionState>((set) => ({
  status: 'loading',
  user: null,
  accessToken: null,
  refreshToken: null,

  async hydrate() {
    try {
      const [accessToken, refreshToken, user] = await Promise.all([
        SecureStore.getItemAsync(KEYS.access),
        SecureStore.getItemAsync(KEYS.refresh),
        SecureStore.getItemAsync(KEYS.user),
      ]);
      if (!refreshToken || !user) return set({ status: 'signed-out' });
      set({ status: 'signed-in', accessToken, refreshToken, user: JSON.parse(user) });
    } catch {
      set({ status: 'signed-out' }); // unreadable storage: start over rather than hang on the splash
    }
  },

  async setSession({ user, accessToken, refreshToken }) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.access, accessToken),
      SecureStore.setItemAsync(KEYS.refresh, refreshToken),
      SecureStore.setItemAsync(KEYS.user, JSON.stringify(user)),
    ]);
    set({ status: 'signed-in', user, accessToken, refreshToken });
  },

  async setTokens(accessToken, refreshToken) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.access, accessToken),
      SecureStore.setItemAsync(KEYS.refresh, refreshToken),
    ]);
    set({ accessToken, refreshToken });
  },

  async clear() {
    await Promise.all(Object.values(KEYS).map((key) => SecureStore.deleteItemAsync(key)));
    set({ status: 'signed-out', user: null, accessToken: null, refreshToken: null });
  },
}));

export { useSession };
