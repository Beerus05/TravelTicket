import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, Switch } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser, toggleTheme } from '../../store/bookingSlice';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(setUser(null));
    router.replace('/(auth)/login');
  };

  return (
    <YStack f={1} p="$4" bg="$background" gap="$4" ai="center">
      <Card
        w="100%"
        maxWidth={500}
        p="$5"
        borderWidth={1}
        borderColor="$gray5"
        br="$4"
        gap="$3"
      >
        <Text fontSize="$7" fontWeight="bold">
          {user?.name || 'Nguyễn Đình Phi'}
        </Text>
        <Text color="$gray10">{user?.email || 'phi@student.iuh.edu.vn'}</Text>

        <Separator my="$2" />

        <XStack jc="space-between" ai="center" py="$2">
          <YStack>
            <Text fontWeight="600">Chế độ hiển thị Giao diện</Text>
            <Text fontSize="$2" color="$gray10">
              Hiện tại: {themeMode === 'dark' ? 'Giao diện Tối (Dark)' : 'Giao diện Sáng (Light)'}
            </Text>
          </YStack>
          <Switch
            checked={themeMode === 'dark'}
            onCheckedChange={() => dispatch(toggleTheme())}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>

        <Separator my="$2" />

        <Text fontSize="$4" color="$gray11">Phiên bản ứng dụng: 1.0.0 (Expo + Tamagui)</Text>
        <Text fontSize="$4" color="$gray11">Hạng thành viên: Vàng (Gold Member)</Text>
        <Text fontSize="$4" color="$gray11">Mã sinh viên: 21012345 (IUH)</Text>

        <Button
          mt="$4"
          theme="red"
          size="md"
          onPress={handleLogout}
        >
          Đăng xuất
        </Button>
      </Card>
    </YStack>
  );
}
