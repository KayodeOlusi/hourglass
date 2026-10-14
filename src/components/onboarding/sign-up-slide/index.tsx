import { Platform, StyleSheet, View } from 'react-native';

import { AuthButton } from '@/components/global/auth-button';
import { Text } from '@/components/global/text';
import type { AuthProvider } from '@/services/types';

type SignUpSlideProps = {
  onSignIn: (provider: AuthProvider) => void;
  pending: AuthProvider | null; // provider whose sign-in is in flight
};

// Onboarding 3/3 (Figma 413:626): sign up with Apple or Google.
// Apple sign-in is native only on iOS, so Android shows Google alone.
function SignUpSlide({ onSignIn, pending }: SignUpSlideProps) {
  return (
    <View style={styles.slide}>
      <Text variant="pageTitle">Create your account</Text>
      <Text variant="lead" color="dim" style={styles.subtitle}>
        Save your events and notes across devices.
      </Text>
      <View style={styles.buttons}>
        {Platform.OS === 'ios' && (
          <AuthButton
            provider="apple"
            onPress={() => onSignIn('apple')}
            loading={pending === 'apple'}
            disabled={!!pending}
          />
        )}
        <AuthButton
          provider="google"
          onPress={() => onSignIn('google')}
          loading={pending === 'google'}
          disabled={!!pending}
        />
      </View>
      <Text variant="fine" color="dim" style={styles.legal}>
        By continuing you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  subtitle: { marginTop: 8 },
  buttons: { marginTop: 30, gap: 11 },
  legal: { marginTop: 20, textAlign: 'center' },
});

export { SignUpSlide };
