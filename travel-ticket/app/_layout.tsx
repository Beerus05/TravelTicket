import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import tamaguiConfig from '../tamagui.config';
import { store, RootState } from '../store/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppNavigation() {
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={themeMode || 'light'}>
      <Theme name={themeMode || 'light'}>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            headerTintColor: '#0066FF',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="ticket/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="booking/seat-selection" options={{ headerShown: false }} />
          <Stack.Screen name="booking/checkout" options={{ headerShown: false }} />
          <Stack.Screen name="booking/e-ticket" options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <AppNavigation />
          </QueryClientProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
