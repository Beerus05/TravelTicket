import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, Switch, ScrollView } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setUser, toggleTheme, clearBookingDraft } from '../../store/bookingSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';
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
    <ScrollView
      f={1}
      bg="$background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        padding: 16,
        paddingBottom: 32,
      }}
    >
      <Card
        w="100%"
        maxWidth={460}
        p="$4"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
        br="$5"
        gap="$3"
      >
        {/* Avatar & Thông tin cơ bản */}
        <XStack gap="$3" ai="center">
          <YStack
            w={60}
            h={60}
            br="$10"
            bg="#0066FF"
            jc="center"
            ai="center"
            borderWidth={2.5}
            borderColor={isDark ? '#38BDF8' : '#DBEAFE'}
          >
            <Text color="#FFFFFF" fontSize="$6" fontWeight="900">
              {getInitials(user?.name)}
            </Text>
          </YStack>

          <YStack f={1} gap="$0.5">
            <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
              {user?.name || 'Nguyễn Đình Phi'}
            </Text>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">
              {user?.email || 'phi@student.iuh.edu.vn'}
            </Text>
            <XStack mt="$1">
              <YStack
                px="$2"
                py="$0.5"
                br="$10"
                bg={isDark ? '#451A03' : '#FEF3C7'}
                borderWidth={1}
                borderColor={isDark ? '#92400E' : '#FDE68A'}
              >
                <Text color={isDark ? '#FBBF24' : '#B45309'} fontSize="$1.5" fontWeight="bold">
                  ⭐ Thành viên Vàng (Gold)
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </XStack>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$0.5" />

        {/* Chuyển đổi Dark/Light mode */}
        <XStack jc="space-between" ai="center" py="$1.5">
          <YStack>
            <Text fontWeight="600" fontSize="$3.5" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Giao diện Ứng dụng
            </Text>
            <Text fontSize="$2" color={isDark ? '#94A3B8' : '#64748B'}>
              {isDark ? 'Chế độ Tối (Dark mode)' : 'Chế độ Sáng (Light mode)'}
            </Text>
          </YStack>
          <Switch
            checked={isDark}
            onCheckedChange={() => dispatch(toggleTheme())}
          >
            <Switch.Thumb />
          </Switch>
        </XStack>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$0.5" />

        {/* Thông tin sinh viên & đề tài (IUH) */}
        <YStack
          gap="$2"
          bg={isDark ? '#0F172A' : '#F8FAFC'}
          borderWidth={1}
          borderColor={isDark ? '#334155' : '#E2E8F0'}
          p="$3"
          br="$4"
        >
          <Text fontWeight="800" fontSize="$3" color={isDark ? '#38BDF8' : '#0066FF'}>
            🎓 THÔNG TIN ĐỀ TÀI BÀI TẬP LỚN (IUH)
          </Text>

          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">SV1 (Trưởng nhóm):</Text>
            <Text fontWeight="700" fontSize="$2.5" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Nguyễn Đình Phi (21012345)
            </Text>
          </XStack>

          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">SV2 (Thành viên):</Text>
            <Text fontWeight="700" fontSize="$2.5" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Vũ Trần Đức Nghĩa (23637711)
            </Text>
          </XStack>

          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">Trường:</Text>
            <Text fontWeight="600" fontSize="$2.5" color={isDark ? '#F8FAFC' : '#0F172A'}>
              ĐH Công nghiệp TP.HCM (IUH)
            </Text>
          </XStack>

          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">Công nghệ:</Text>
            <Text fontWeight="600" fontSize="$2.5" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Expo + Tamagui + Redux + TanStack
            </Text>
          </XStack>
        </YStack>

        {/* Nút Đăng xuất */}
        <Button
          mt="$2"
          bg="#DC2626"
          height={46}
          br="$4"
          onPress={handleLogout}
        >
          <Text color="#FFFFFF" fontWeight="bold" fontSize="$3.5">
            🚪 Đăng xuất tài khoản
          </Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
