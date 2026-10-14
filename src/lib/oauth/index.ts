import * as Application from 'expo-application';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

// What a provider hands back for the server's /auth/oauth/:provider. null means the user cancelled.
type Credential = { id_token: string; first_name?: string; last_name?: string } | null;

const google = {
  discovery: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
  clientId: Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  }),
};

// Google's native clients redirect to a custom scheme: the reversed client ID on iOS, the package on Android.
function googleRedirectUri(clientId: string) {
  const scheme =
    Platform.OS === 'ios' ? clientId.split('.').reverse().join('.') : Application.applicationId;
  return AuthSession.makeRedirectUri({ native: `${scheme}:/oauthredirect` });
}

// Google in a browser sheet (code + PKCE). The nonce goes in the request, so Google puts it in the id_token.
async function signInWithGoogle(nonce: string): Promise<Credential> {
  const clientId = google.clientId;
  if (!clientId) throw new Error('Google sign-in is not configured');

  const redirectUri = googleRedirectUri(clientId);
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'email', 'profile'],
    usePKCE: true,
    extraParams: { nonce },
  });

  const result = await request.promptAsync(google.discovery);
  if (result.type === 'error') throw result.error ?? new Error('Google sign-in failed');
  if (result.type !== 'success') return null;

  const tokens = await AuthSession.exchangeCodeAsync(
    { clientId, redirectUri, code: result.params.code, extraParams: { code_verifier: request.codeVerifier ?? '' } },
    google.discovery,
  );
  if (!tokens.idToken) throw new Error('Google returned no id_token');
  return { id_token: tokens.idToken };
}

// Native Apple sheet (iOS only). Apple shares the name on the first sign-in only, so pass it on.
async function signInWithApple(nonce: string): Promise<Credential> {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce,
    });
    if (!credential.identityToken) throw new Error('Apple returned no identity token');
    return {
      id_token: credential.identityToken,
      first_name: credential.fullName?.givenName ?? undefined,
      last_name: credential.fullName?.familyName ?? undefined,
    };
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return null;
    throw error;
  }
}

export { signInWithApple, signInWithGoogle };
