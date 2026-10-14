import { IconProps } from 'phosphor-react-native';
import { ComponentType } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/global/text';
import { radius, useTheme } from '@/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: ComponentType<IconProps>; // trailing icon, e.g. ArrowRight
};

// Primary pill button: navy fill, label + optional trailing icon.
// Press feedback follows the platform: ripple on Android, dimming on iOS.
function Button({ label, onPress, icon: Icon }: ButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.2)', foreground: true }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.navy },
        Platform.OS === 'ios' && pressed && styles.pressed,
      ]}>
      <Text variant="button" color="onNavy">
        {label}
      </Text>
      {Icon && <Icon size={15} weight="bold" color={colors.onNavy} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: radius.pill,
    overflow: 'hidden', // clips the Android ripple to the pill
  },
  pressed: { opacity: 0.85 },
});

export { Button };
