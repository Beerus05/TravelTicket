import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <YStack f={1} jc="center" ai="center" bg="blue10" p="$6" gap="$4">
      <YStack
        ai="center"
        gap="$3"
        maxWidth={500}
      >
        <Text color="white" fontSize="$10" fontWeight="900" ta="center">
          TRAVEL TICKET
        </Text>
        <Text color="blue2" fontSize="$5" ta="center">
          Đặt vé Máy bay, Tàu hỏa, Xe khách nhanh chóng cùng Trợ lý AI
        </Text>
        <Text color="white" opacity={0.8} fontSize="$3" ta="center" mt="$2">
          Hệ thống đặt vé du lịch & săn vé giá rẻ thông minh
        </Text>
      </YStack>

      <Button
        size="lg"
        mt="$6"
        bg="white"
        color="blue10"
        fontWeight="bold"
        br="$4"
        onPress={() => router.replace('/(auth)/login')}
      >
        Bắt đầu ngay ➔
      </Button>
    </YStack>
  );
}
