import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '@/hooks/useApp';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();
  const { isOnboarded, user } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isOnboarded]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.gold} />
    </View>
  );
}
