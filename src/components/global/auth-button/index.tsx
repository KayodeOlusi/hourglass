import { ActivityIndicator, Platform, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '@/components/global/text';
import { radius, useTheme } from '@/theme';

type AuthButtonProps = {
  provider: 'apple' | 'google';
  onPress: () => void;
  loading?: boolean; // spinner in place of the logo
  disabled?: boolean;
};

// Full-width "Continue with …" button. Apple is a solid ink fill; Google is outlined with a gold G.
function AuthButton({ provider, onPress, loading = false, disabled = false }: AuthButtonProps) {
  const { colors } = useTheme();
  const apple = provider === 'apple';
  const fg = apple ? colors.bg : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      android_ripple={{ color: apple ? 'rgba(255, 255, 255, 0.16)' : 'rgba(23, 35, 60, 0.08)', foreground: true }}
      style={({ pressed }) => [
        styles.button,
        apple
          ? { backgroundColor: colors.text }
          : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, padding: 15 }, // same height as Apple
        Platform.OS === 'ios' && pressed && styles.pressed,
        disabled && !loading && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={apple ? fg : colors.gold} style={styles.spinner} />
      ) : apple ? (
        <Logo d={APPLE} size={18} color={fg} />
      ) : (
        <Logo d={GOOGLE} size={16} color={colors.gold} />
      )}
      <Text variant="emphasis" style={{ color: fg }}>
        Continue with {apple ? 'Apple' : 'Google'}
      </Text>
    </Pressable>
  );
}

// Single-color brand marks (Simple Icons, CC0) on a 24×24 grid.
const APPLE =
  'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701';
const GOOGLE =
  'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z';

function Logo({ d, size, color }: { d: string; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={d} fill={color} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: radius.button,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  spinner: { width: 18, height: 18 },
});

export { AuthButton };
