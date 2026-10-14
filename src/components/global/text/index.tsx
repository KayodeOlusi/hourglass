import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { Colors, type, TypeVariant, useTheme } from '@/theme';

type TextProps = RNTextProps & {
  variant?: TypeVariant;
  color?: keyof Colors;
};

// App-wide Text: applies the type scale and theme color, so screens never set fonts by hand.
function Text({ variant = 'body', color = 'text', style, ...props }: TextProps) {
  const { colors } = useTheme();
  return <RNText style={[type[variant], { color: colors[color] }, style]} {...props} />;
}

export { Text };
export type { TextProps };
