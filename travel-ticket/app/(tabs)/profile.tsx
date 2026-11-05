import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, Switch } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser, toggleTheme, clearBookingDraft } from '../../store/bookingSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(clearBookingDraft());
    queryClient.clear();
    router.replace('/(auth)/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <YStack f={1} p="$4" bg="$background" gap="$4" ai="center">
      <Card
        w="100%"
        maxWidth={500}
        p="$5"
        borderWidth={1}
        borderColor="gray5"
        br="$5"
        gap="$3.5"
      >
        {/* Avatar & Thông tin cơ bản */}
        <XStack gap="$3.5" ai="center">
          <YStack
            w={64}
            h={64}
            br="$10"
            bg="blue10"
            jc="center"
            ai="center"
          >
            <Text color="white" fontSize="$6" fontWeight="900">
              {getInitials(user?.name)}
            </Text>
          </YStack>

          <YStack f={1} gap="$1">
            <Text fontSize="$6" fontWeight="bold">
              {user?.name || 'Nguyễn Đình Phi'}
            </Text>
            <Text color="gray10" fontSize="$3">
              {user?.email || 'phi@student.iuh.edu.vn'}
            </Text>
            <XStack mt="$1">
              <YStack px="$2.5" py="$1" br="$10" bg="orange3">
                <Text color="orange10" fontSize="$2" fontWeight="bold">
                  ⭐ Thành viên Vàng (Gold)
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>

        <Separator borderColor="gray4" my="$1" />

        {/* Chuyển đổi Dark/Light mode */}
        <XStack jc="space-between" ai="center" py="$2">
          <YStack>
            <Text fontWeight="600" fontSize="$4">Giao diện Ứng dụng</Text>
            <Text fontSize="$2" color="gray10">
              {themeMode === 'dark' ? 'Chế độ Tối (Dark mode)' : 'Chế độ Sáng (Light mode)'}
            </Text>
          </YStack>
          <Switch
            checked={themeMode === 'dark'}
            onCheckedChange={() => dispatch(toggleTheme())}
          >
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>

        <Separator borderColor="gray4" my="$1" />

        {/* Thông tin sinh viên & đề tài */}
        <YStack gap="$2" bg="gray3" p="$3.5" br="$4">
          <XStack jc="space-between">
            <Text color="gray10" fontSize="$3">Sinh viên thực hiện:</Text>
            <Text fontWeight="600" fontSize="$3">Nguyễn Đình Phi</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10" fontSize="$3">Mã số sinh viên:</Text>
            <Text fontWeight="600" fontSize="$3">21012345</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10" fontSize="$3">Trường:</Text>
            <Text fontWeight="600" fontSize="$3">ĐH Công nghiệp TP.HCM (IUH)</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10" fontSize="$3">Phiên bản nền tảng:</Text>
            <Text fontWeight="600" fontSize="$3">Expo SDK 58 + Tamagui</Text>
          </XStack>
        </YStack>

        {/* Nút Đăng xuất */}
        <Button
          mt="$3"
          bg="#DC2626"
          pressStyle={{ bg: '#B91C1C' }}
          size="lg"
          br="$4"
          onPress={handleLogout}
        >
          <Text color="#FFFFFF" fontWeight="bold" fontSize="$4">
            🚪 Đăng xuất tài khoản
          </Text>
        </Button>
      </Card>
    </YStack>
  );
}
