import { BellRinging, CalendarPlus, IconProps, NotePencil } from 'phosphor-react-native';
import { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/global/text';
import { useTheme } from '@/theme';

const features: { icon: ComponentType<IconProps>; title: string; body: string }[] = [
  { icon: CalendarPlus, title: 'Plan in seconds', body: 'Create personal online events — just for you.' },
  { icon: BellRinging, title: 'Never miss a thing', body: 'Smart reminders before every event begins.' },
  { icon: NotePencil, title: 'Notes as you go', body: 'Take notes live during an event — AI summaries soon.' },
];

// Onboarding 2/3 (Figma 413:544): headline and the three feature rows.
function FeaturesSlide() {
  const { colors } = useTheme();
  return (
    <View style={styles.slide}>
      <Text variant="pageTitle">{'Your time,\nyour way'}</Text>
      <View style={styles.list}>
        {features.map(({ icon: Icon, title, body }) => (
          <View key={title} style={styles.row}>
            <View style={[styles.iconTile, { backgroundColor: colors.navySoft }]}>
              <Icon size={23} weight="fill" color={colors.gold} />
            </View>
            <View style={styles.copy}>
              <Text variant="emphasis">{title}</Text>
              <Text variant="small" color="dim">
                {body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  list: { marginTop: 32, gap: 20 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 15 },
  iconTile: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
});

export { FeaturesSlide };
