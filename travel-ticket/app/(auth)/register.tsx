import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, Card, ScrollView, Separator } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearBookingDraft } from '../../store/bookingSlice';
import { RootState } from '../../store/store';
import { useQueryClient } from '@tanstack/react-query';
import { Ticket } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const handleRegister = () => {
    if (!name.trim() || !email.trim()) return;
    queryClient.clear();
    dispatch(clearBookingDraft());
    dispatch(setUser({ name: name.trim(), email: email.trim() }));
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView
      f={1}
      bg="$background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: Math.max(insets.top + 16, 28),
        paddingBottom: Math.max(insets.bottom + 24, 36),
        paddingHorizontal: 16,
      }}
    >
      <Card
        w="100%"
        maxWidth={420}
        p="$4"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
        br="$5"
        gap="$3.5"
      >
        {/* Header */}
        <YStack ai="center" gap="$1.5" pt="$1">
          <YStack w={52} h={52} br="$10" bg="#0066FF" jc="center" ai="center">
            <Ticket color="#ffffff" size={26} />
          </YStack>
          <Text fontSize="$7" fontWeight="900" color="#0066FF" letterSpacing={0.5} ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$2.5" color={isDark ? '#94A3B8' : '#64748B'} ta="center">
            Tạo tài khoản thành viên mới
          </Text>
        </YStack>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} />

        <YStack gap="$2.5">
          <YStack gap="$1">
            <Text fontSize="$2.5" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              👤 Họ và tên
            </Text>
            <Input
              height={44}
              fontSize={14}
              placeholder="Nhập họ và tên đầy đủ"
              value={name}
              onChangeText={setName}
              br="$4"
              borderWidth={1.5}
              borderColor={isDark ? '#334155' : '#CBD5E1'}
              bg={isDark ? '#0F172A' : '#FFFFFF'}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            />
          </YStack>

          <YStack gap="$1">
            <Text fontSize="$2.5" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              ✉️ Địa chỉ Email
            </Text>
            <Input
              height={44}
              fontSize={14}
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              br="$4"
              borderWidth={1.5}
              borderColor={isDark ? '#334155' : '#CBD5E1'}
              bg={isDark ? '#0F172A' : '#FFFFFF'}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>

          <YStack gap="$1">
            <Text fontSize="$2.5" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              🔒 Mật khẩu
            </Text>
            <Input
              height={44}
              fontSize={14}
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              br="$4"
              borderWidth={1.5}
              borderColor={isDark ? '#334155' : '#CBD5E1'}
              bg={isDark ? '#0F172A' : '#FFFFFF'}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            />
          </YStack>
        </YStack>

        <Button
          height={48}
          bg="#0066FF"
          onPress={handleRegister}
          br="$4"
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$3.5">
            TẠO TÀI KHOẢN & BẮT ĐẦU ➔
          </Text>
        </Button>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} />

        <XStack jc="center" ai="center">
          <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">
            Đã có tài khoản?{' '}
          </Text>
          <Text
            color={isDark ? '#38BDF8' : '#0066FF'}
            fontSize="$2.5"
            fontWeight="bold"
            onPress={() => router.back()}
          >
            Đăng nhập ngay
          </Text>
        </XStack>
      </Card>
    </ScrollView>
  );
}
