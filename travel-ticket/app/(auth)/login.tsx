import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, Card, ScrollView, Separator } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearBookingDraft } from '../../store/bookingSlice';
import { RootState } from '../../store/store';
import { useQueryClient } from '@tanstack/react-query';
import { Ticket } from '../../components/Icons';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const handleLogin = (customName?: string, customEmail?: string) => {
    const finalName = customName || name;
    const finalEmail = customEmail || email;
    if (!finalName.trim() || !finalEmail.trim()) return;
    queryClient.clear();
    dispatch(clearBookingDraft());
    dispatch(setUser({ name: finalName.trim(), email: finalEmail.trim() }));
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView f={1} bg="$background" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Card
        w="100%"
        maxWidth={450}
        p="$5"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        br="$5"
        gap="$4"
        bg={isDark ? '#1E293B' : '#FFFFFF'}
      >
        {/* Banner thương hiệu trên cùng */}
        <YStack ai="center" gap="$2" pt="$2">
          <YStack
            w={64}
            h={64}
            br="$10"
            bg="#0066FF"
            jc="center"
            ai="center"
          >
            <Ticket color="#ffffff" size={32} />
          </YStack>

          <Text fontSize="$8" fontWeight="900" color="#0066FF" letterSpacing={0.5} ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'} ta="center">
            Đặt vé Máy bay • Xe khách • Tàu hỏa & Trợ lý AI
          </Text>
        </YStack>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} />

        <YStack gap="$1">
          <Text fontSize="$6" fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
            Chào mừng trở lại!
          </Text>
          <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'}>
            Vui lòng nhập thông tin để tiếp tục
          </Text>
        </YStack>

        {/* Các ô nhập liệu */}
        <YStack gap="$3">
          <YStack gap="$1.5">
            <Text fontSize="$3" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              👤 Họ và tên hành khách
            </Text>
            <Input
              height={48}
              fontSize="$4"
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

          <YStack gap="$1.5">
            <Text fontSize="$3" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              ✉️ Địa chỉ Email
            </Text>
            <Input
              height={48}
              fontSize="$4"
              placeholder="Nhập email (VD: phi@student.iuh.edu.vn)"
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

          <YStack gap="$1.5">
            <Text fontSize="$3" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              🔒 Mật khẩu
            </Text>
            <Input
              height={48}
              fontSize="$4"
              placeholder="Nhập mật khẩu"
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

        {/* Nút Đăng nhập chính */}
        <Button
          height={52}
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          br="$4"
          onPress={() => handleLogin()}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            ĐĂNG NHẬP VÀO HỆ THỐNG ➔
          </Text>
        </Button>

        {/* Nút Đăng nhập nhanh tài khoản mẫu */}
        <Button
          size="sm"
          bg={isDark ? '#334155' : '#F1F5F9'}
          borderWidth={1}
          borderColor={isDark ? '#475569' : '#CBD5E1'}
          pressStyle={{ bg: isDark ? '#475569' : '#E2E8F0' }}
          br="$3"
          onPress={() => handleLogin('Nguyễn Đình Phi', 'phi@student.iuh.edu.vn')}
        >
          <Text color={isDark ? '#F8FAFC' : '#1E293B'} fontWeight="bold" fontSize="$3">
            ⚡ Đăng nhập nhanh (Tài khoản mẫu IUH)
          </Text>
        </Button>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} />

        {/* Điều hướng Đăng ký */}
        <XStack jc="center" ai="center">
          <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">
            Chưa có tài khoản?{' '}
          </Text>
          <Text
            color={isDark ? '#38BDF8' : '#0066FF'}
            fontSize="$3"
            fontWeight="bold"
            onPress={() => router.push('/(auth)/register')}
          >
            Đăng ký tài khoản mới
          </Text>
        </XStack>
      </Card>
    </ScrollView>
  );
}
