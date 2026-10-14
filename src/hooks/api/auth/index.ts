import { useState } from 'react';
import { Alert } from 'react-native';

import { getDeviceInfo } from '@/lib/device';
import { signInWithApple, signInWithGoogle } from '@/lib/oauth';
import { errorMessage } from '@/services/http';
import { AuthRequests } from '@/services/requests';
import type { AuthProvider } from '@/services/types';
import { useSession } from '@/store/session';

const providers = { apple: signInWithApple, google: signInWithGoogle };

// Auth requests for screens: destructure what you need, e.g. const { signIn, pending } = useAuth().
function useAuth() {
  const [pending, setPending] = useState<AuthProvider | null>(null);

  // Fresh nonce → provider sheet → server sign-in → saved session. Resolves true once signed in,
  // false if the user cancelled or it failed (failures show an alert).
  async function signIn(provider: AuthProvider) {
    if (pending) return false;
    setPending(provider);
    try {
      const { data } = await AuthRequests.getNonce();
      const credential = await providers[provider](data.nonce);
      if (!credential) return false;

      const res = await AuthRequests.signIn(provider, {
        ...credential,
        nonce: data.nonce,
        device: await getDeviceInfo(),
      });
      await useSession.getState().setSession({
        user: res.data,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      });
      return true;
    } catch (error) {
      Alert.alert("Couldn't sign in", errorMessage(error));
      return false;
    } finally {
      setPending(null);
    }
  }

  // Ends this device's session (or every device's). Signs out locally even if the server call fails.
  async function logout(everywhere = false) {
    try {
      await (everywhere ? AuthRequests.logoutAll() : AuthRequests.logout());
    } catch {
      // Already signed out locally below; the server session expires on its own.
    } finally {
      await useSession.getState().clear();
    }
  }

  return { signIn, logout, pending };
}

export { useAuth };
