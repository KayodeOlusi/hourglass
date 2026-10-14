import type { ConfigContext, ExpoConfig } from 'expo/config';

// app.json holds the config; this only adds what comes from .env.local.
// Google's iOS sign-in redirects to the reversed client ID, so the app must register it as a URL scheme.
export default ({ config }: ConfigContext): ExpoConfig => {
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const googleScheme = iosClientId?.split('.').reverse().join('.');

  return {
    ...config,
    name: config.name ?? 'Hourglass',
    slug: config.slug ?? 'hourglass',
    scheme: [config.scheme, googleScheme].flat().filter((s): s is string => !!s),
  };
};
