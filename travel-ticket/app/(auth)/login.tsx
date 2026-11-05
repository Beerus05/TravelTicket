import React, { useState } from 'react';
import { YStack, Input, Button, Text, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/bookingSlice';

export default function LoginScreen() {
  const [name, setName] = useState('Nguyễn Đình Phi');
  const [email, setEmail] = useState('phi@student.iuh.edu.vn');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) return;
    dispatch(setUser({ name, email }));
    router.replace('/(tabs)/home');
  };

  return (
    <YStack f={1} jc="center" ai="center" p="$4" bg="$background">
      <Card
        w="100%"
        maxWidth={450}
        p="$5"
        borderWidth={1}
        borderColor="gray5"
        br="$4"
        gap="$4"
      >
        <Text fontSize="$8" fontWeight="bold" ta="center" color="blue10">
          TRAVEL TICKET
        </Text>
        <Text fontSize="$6" fontWeight="bold" ta="center">
          Đăng nhập tài khoản
        </Text>

        <YStack gap="$3">
          <Input
            placeholder="Họ và tên"
            value={name}
            onChangeText={setName}
            size="$4"
          />
          <Input
            placeholder="Email sinh viên / cá nhân"
            value={email}
            onChangeText={setEmail}
            size="$4"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </YStack>

        <Button
          theme="active"
          size="md"
          onPress={handleLogin}
          br="$3"
        >
          Vào ứng dụng
        </Button>

        <Button
          bg="transparent"
          borderWidth={0}
          onPress={() => router.push('/(auth)/register')}
          color="blue10"
        >
          Chưa có tài khoản? Đăng ký ngay
        </Button>
      </Card>
    </YStack>
  );
}
