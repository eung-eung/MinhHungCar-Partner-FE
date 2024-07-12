import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router'; // Updated import
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuthConTextProvider, { AuthConText } from '@/store/AuthContext';
import ProtectedProvider from '@/components/Auth/ProtectedProvider';
import BackButton from '@/components/BackButton';
import NotificationHandler from '@/store/NotificationContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Use useRouter hook instead of useNavigation
  return (
    <AuthConTextProvider>
      <NotificationHandler>
        <ProtectedProvider>
          {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false, }} />
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
                gestureEnabled: false,
                title: 'Hợp đồng',
              }} />
            <Stack.Screen name="addCarInfo/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Đăng kí xe',
                gestureEnabled: false,
                headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
                  subTitle="Bạn đang ở màn hình nhập thông xin xe. Bạn có muốn hủy và trở về?"
                  callBack={() => router.replace("/car")}
                />
              }} />
            <Stack.Screen name="addCarPhoto/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Đăng kí xe',
                gestureEnabled: false,
                headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
                  subTitle="Bạn đang ở màn hình nhập thông xin xe. Bạn có muốn hủy và trở về?"
                  callBack={() => router.replace("/car")}
                />
              }} />
            <Stack.Screen name="addRegist/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Đăng kí xe',
                gestureEnabled: false,
                headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
                  subTitle="Bạn đang ở màn hình nhập thông xin xe. Bạn có muốn hủy và trở về?"
                  callBack={() => router.replace("/car")}
                />
              }} />
            <Stack.Screen name="rentingFee/index"
              options={{
                headerBackTitleVisible: false,
                title: 'Đăng kí xe',
                gestureEnabled: false,
                headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
                  subTitle="Bạn đang ở màn hình nhập thông xin xe. Bạn có muốn hủy và trở về?"
                  callBack={() => router.replace("/car")}
                />
              }} />
            <Stack.Screen name="detail/[slug]"
              options={{
                headerBackTitleVisible: false,
                title: 'Chi tiết xe',
              }} />
            <Stack.Screen name="success/index"
              options={{
                headerBackTitleVisible: false,
                gestureEnabled: false,
                headerShown: false
              }} />

            <Stack.Screen name="history/index"
              options={{
                headerBackTitleVisible: false,
                // gestureEnabled: false,
                title: 'Lịch sử hoạt động'
              }} />
            <Stack.Screen name="activityDetail/index"
              options={{
                headerBackTitleVisible: false,
                // gestureEnabled: false,
                title: 'Chi tiết hoạt động'
              }} />
          </Stack>

          {/* </ThemeProvider> */}
        </ProtectedProvider>
      </NotificationHandler>
    </AuthConTextProvider>
  );
}
