import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearBookingDraft } from '../../store/bookingSlice';
import { RootState } from '../../store/store';
import { useQueryClient } from '@tanstack/react-query';
import { Ticket } from '../../components/Icons';

export default function RegisterScreen() {
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
    <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
      <Card
        w="100%"
        maxWidth={440}
        p="$5"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
        br="$5"
        gap="$4"
      >
        {/* Header */}
        <YStack ai="center" gap="$2">
          <YStack w={56} h={56} br="$10" bg="#0066FF" jc="center" ai="center">
            <Ticket color="#ffffff" size={28} />
          </YStack>
          <Text fontSize="$8" fontWeight="900" color="#0066FF" ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$4" color={isDark ? '#94A3B8' : '#64748B'} ta="center">
            Đăng ký tài khoản mới
          </Text>
        </YStack>

        <YStack gap="$3">
          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Họ và tên
            </Text>
            <Input
              placeholder="Nhập họ và tên đầy đủ"
              value={name}
              onChangeText={setName}
              size="$4"
              br="$3"
              borderWidth={1.5}
              borderColor={isDark ? '#334155' : '#CBD5E1'}
              bg={isDark ? '#0F172A' : '#FFFFFF'}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            />
          </YStack>

          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Địa chỉ Email
            </Text>
            <Input
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              size="$4"
              br="$3"
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
            <Text fontSize="$3" fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Mật khẩu
            </Text>
            <Input
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              size="$4"
              br="$3"
              borderWidth={1.5}
              borderColor={isDark ? '#334155' : '#CBD5E1'}
              bg={isDark ? '#0F172A' : '#FFFFFF'}
              color={isDark ? '#F8FAFC' : '#0F172A'}
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            />
          </YStack>
        </YStack>

        <Button
          height={52}
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          onPress={handleRegister}
          br="$4"
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            TẠO TÀI KHOẢN & BẮT ĐẦU ➔
          </Text>
        </Button>

        <XStack jc="center" ai="center" mt="$1">
          <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">
            Đã có tài khoản?{' '}
          </Text>
          <Text
            color={isDark ? '#38BDF8' : '#0066FF'}
            fontSize="$3"
            fontWeight="bold"
            onPress={() => router.back()}
          >
            Đăng nhập
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
}
