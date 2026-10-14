import { Redirect } from 'expo-router';

import { useSession } from '@/store/session';

// Entry: signed-in users go straight to their events, everyone else to onboarding.
export default function Index() {
  const signedIn = useSession((state) => state.status === 'signed-in');
  return <Redirect href={signedIn ? '/events' : '/onboarding'} />;
}
