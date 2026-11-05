import React, { useState } from 'react';
import { YStack, Input, Button, Text, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/bookingSlice';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRegister = () => {
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
        gap="$3"
      >
        <Text fontSize="$8" fontWeight="bold" ta="center">
          Đăng ký tài khoản
        </Text>
        <Input
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
          size="$4"
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          size="$4"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          size="$4"
        />
        <Button
          theme="active"
          size="md"
          onPress={handleRegister}
          br="$3"
        >
          Tạo tài khoản
        </Button>
        <Button
          bg="transparent"
          borderWidth={0}
          onPress={() => router.back()}
          color="blue10"
        >
          Đã có tài khoản? Đăng nhập
        </Button>
      </Card>
    </YStack>
  );
}
