import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { radius, useTheme } from '@/theme';

// Step indicator: the active step is a wide gold pill, the rest are small dots.
// Changing `index` eases the pill across.
function PageDots({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Step ${index + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} active={i === index} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    width: withTiming(active ? 22 : 7, { duration: 280 }),
    backgroundColor: withTiming(active ? colors.gold : colors.border, { duration: 280 }),
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 7 },
  dot: { height: 7, borderRadius: radius.pill },
});

export { PageDots };
