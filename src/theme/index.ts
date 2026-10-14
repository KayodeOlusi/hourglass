import { useColorScheme } from 'react-native';

import { brand, colors, fonts, radius, shadow, spacing, type } from './tokens';

function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: colors[scheme] } as const;
}

export { useTheme, brand, colors, fonts, radius, shadow, spacing, type };
export type { Colors, ColorScheme, TypeVariant } from './tokens';
