import { StyleSheet, View } from 'react-native';

import { LogoTile } from '@/components/global/logo-tile';
import { Text } from '@/components/global/text';

// Onboarding 1/3 (Figma 413:461): animated logo, name and tagline.
function WelcomeSlide() {
  return (
    <View style={styles.slide}>
      <LogoTile animated />
      <Text variant="display" style={styles.title}>
        Hourglass
      </Text>
      <Text variant="subtitle" color="dim" style={styles.tagline}>
        Every moment worth planning for — your events and notes, beautifully kept.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  title: { marginTop: 30, textAlign: 'center' },
  tagline: { marginTop: 9, textAlign: 'center' },
});

export { WelcomeSlide };
