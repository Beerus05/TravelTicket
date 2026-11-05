import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/bookingSlice';
import { Ticket } from '../../components/Icons';

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
        maxWidth={440}
        p="$5"
        borderWidth={1}
        borderColor="gray5"
        br="$5"
        gap="$4"
      >
        {/* Header */}
        <YStack ai="center" gap="$2">
          <YStack w={56} h={56} br="$10" bg="blue10" jc="center" ai="center">
            <Ticket color="#ffffff" size={28} />
          </YStack>
          <Text fontSize="$8" fontWeight="900" color="blue10" ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$4" color="gray11" ta="center">
            Đăng ký tài khoản mới
          </Text>
        </YStack>

        <YStack gap="$3">
          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="600" color="gray11">
              Họ và tên
            </Text>
            <Input
              placeholder="Nhập họ và tên đầy đủ"
              value={name}
              onChangeText={setName}
              size="$4"
              br="$3"
            />
          </YStack>

          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="600" color="gray11">
              Địa chỉ Email
            </Text>
            <Input
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              size="$4"
              br="$3"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>

          <YStack gap="$1">
            <Text fontSize="$3" fontWeight="600" color="gray11">
              Mật khẩu
            </Text>
            <Input
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              size="$4"
              br="$3"
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
          <Text color="gray11" fontSize="$3">
            Đã có tài khoản?{' '}
          </Text>
          <Text
            color="blue10"
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
