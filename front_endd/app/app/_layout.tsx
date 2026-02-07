import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';


import { useColorScheme } from '@/hooks/use-color-scheme';
import { PlayerProvider } from '@/store/PlayerContext';
import { NowPlayingBar } from '@/components/player/NowPlayingBar';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  return (
    <PlayerProvider>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <NowPlayingBar />
      <StatusBar style="auto" />
    </ThemeProvider>
    </QueryClientProvider>
    </PlayerProvider>
  );
}
