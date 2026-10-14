import { Tabs } from 'expo-router';
import { Bell, CalendarDots, IconProps, NotePencil, UserCircle } from 'phosphor-react-native';
import { ComponentType } from 'react';

import { type, useTheme } from '@/theme';

// Line icon by default, filled when the tab is active (design convention).
function tabIcon(Icon: ComponentType<IconProps>) {
  return function TabIcon({ focused }: { focused: boolean }) {
    const { colors } = useTheme();
    return <Icon size={24} color={focused ? colors.navy : colors.dim} weight={focused ? 'fill' : 'regular'} />;
  };
}

// Plain themed tab bar for now; the floating pill bar comes with the Figma screens.
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.dim,
        tabBarLabelStyle: type.tabLabel,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="events" options={{ title: 'Events', tabBarIcon: tabIcon(CalendarDots) }} />
      <Tabs.Screen name="notes" options={{ title: 'Notes', tabBarIcon: tabIcon(NotePencil) }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: tabIcon(Bell) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon(UserCircle) }} />
    </Tabs>
  );
}
