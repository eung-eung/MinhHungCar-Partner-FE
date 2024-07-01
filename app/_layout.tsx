import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router'; // Updated import
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuthConTextProvider, { AuthConText } from '@/store/AuthContext';
import ProtectedProvider from '@/components/Auth/ProtectedProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Use useRouter hook instead of useNavigation
  return (
    <AuthConTextProvider>
      <ProtectedProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            {/* config ẩn header ở route signIn */}
            <Stack.Screen name="signIn/index" options={{ headerShown: false }} />
            <Stack.Screen name="signUp/index" options={{ headerShown: false }} />
            <Stack.Screen name="OTP/index" options={{ headerShown: false }} />
            <Stack.Screen name="profile/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Tài khoản của tôi',
              }} />
            <Stack.Screen name="payInfo/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Thông tin thanh toán',
              }} />
            <Stack.Screen name="uploadQR/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Cập nhật mã QR',
              }} />
            <Stack.Screen name="contract/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Hợp đồng',
              }} />
          </Stack>
        </ThemeProvider>
      </ProtectedProvider>
    </AuthConTextProvider>
  );
}
