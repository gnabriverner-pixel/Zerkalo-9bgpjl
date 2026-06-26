import { AlertProvider } from '@/template';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { AppProvider } from '@/contexts/AppContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AlertProvider>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="result" options={{ presentation: 'card' }} />
            <Stack.Screen name="matrix-detail" options={{ presentation: 'card' }} />
            <Stack.Screen name="compatibility" options={{ presentation: 'card' }} />
            <Stack.Screen name="cycles" options={{ presentation: 'card' }} />
            <Stack.Screen name="money-code" options={{ presentation: 'card' }} />
            <Stack.Screen name="age-map" options={{ presentation: 'card' }} />
            <Stack.Screen name="report" options={{ presentation: 'modal' }} />
            <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            <Stack.Screen name="visual-passport" options={{ presentation: 'card' }} />
          </Stack>
        </AppProvider>
      </SafeAreaProvider>
    </AlertProvider>
  );
}
