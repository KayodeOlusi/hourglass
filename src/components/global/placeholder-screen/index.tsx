import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/global/text';
import { spacing, useTheme } from '@/theme';

// Stand-in for screens that haven't been built from Figma yet.
function PlaceholderScreen({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text variant="screenTitle">{title}</Text>
        <Text color="dim">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.screenX, paddingTop: 16, gap: 4 },
});

export { PlaceholderScreen };
