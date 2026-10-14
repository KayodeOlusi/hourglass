import { router } from 'expo-router';
import { ArrowRight } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/global/button';
import { PageDots } from '@/components/global/page-dots';
import { Text } from '@/components/global/text';
import { FeaturesSlide } from '@/components/onboarding/features-slide';
import { SignUpSlide } from '@/components/onboarding/sign-up-slide';
import { WelcomeSlide } from '@/components/onboarding/welcome-slide';
import { useAuth } from '@/hooks/api/auth';
import type { AuthProvider } from '@/services/types';
import { fonts, useTheme } from '@/theme';

const SLIDES = 3;
const LAST = SLIDES - 1;

// Onboarding pager: welcome → features → sign up (Figma 413:461, 413:544, 413:626).
// Swipe or tap Continue to advance; Skip jumps to sign up. On Android, back steps to the previous slide.
export default function OnboardingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const { signIn, pending } = useAuth();

  const goTo = (i: number) => pager.current?.scrollTo({ x: i * width, animated: true });

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (index === 0) return false;
      pager.current?.scrollTo({ x: (index - 1) * width, animated: true });
      return true;
    });
    return () => sub.remove();
  }, [index, width]);

  const onSignIn = async (provider: AuthProvider) => {
    if (await signIn(provider)) router.replace('/events');
  };
  // "Get started" uses the platform's own provider: Apple on iOS, Google on Android.
  const getStarted = () => onSignIn(Platform.OS === 'ios' ? 'apple' : 'google');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        <View style={{ width }}>
          <WelcomeSlide />
        </View>
        <View style={{ width }}>
          <FeaturesSlide />
        </View>
        <View style={{ width }}>
          <SignUpSlide onSignIn={onSignIn} pending={pending} />
        </View>
      </ScrollView>

      {index < LAST && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.skip, { top: insets.top + 15 }]}>
          <Pressable accessibilityRole="button" hitSlop={12} onPress={() => goTo(LAST)}>
            <Text variant="button" color="dim" style={styles.skipLabel}>
              Skip
            </Text>
          </Pressable>
        </Animated.View>
      )}

      <View style={[styles.footer, { bottom: insets.bottom + 12 }]}>
        <PageDots count={SLIDES} index={index} />
        <Button
          label={index === LAST ? 'Get started' : 'Continue'}
          icon={ArrowRight}
          onPress={index === LAST ? getStarted : () => goTo(index + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skip: { position: 'absolute', right: 26 },
  skipLabel: { fontFamily: fonts.medium },
  footer: {
    position: 'absolute',
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
