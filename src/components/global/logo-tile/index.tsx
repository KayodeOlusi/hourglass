import { StyleSheet, View } from 'react-native';

import HourglassMark from '@/assets/images/hourglass-mark-splash.svg';
import { AnimatedHourglass } from '@/components/global/animated-hourglass';
import { brand, shadow } from '@/theme';

// App logo: gold hourglass mark on the ink tile. Brand colors, so it looks the same in light and dark.
// `animated` runs the sand-and-flip loop (splash screen).
function LogoTile({ animated = false }: { animated?: boolean }) {
  return (
    <View style={styles.tile} accessibilityRole="image" accessibilityLabel="Hourglass logo">
      {animated ? <AnimatedHourglass size={56} /> : <HourglassMark width={56} height={56} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: brand.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadow.logo,
  },
});

export { LogoTile };
