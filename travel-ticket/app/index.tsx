import React from 'react';
import { YStack, XStack, Text, Button, Card } from 'tamagui';
import { useRouter } from 'expo-router';
import { Ticket, Sparkles } from '../components/Icons';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <YStack f={1} jc="center" ai="center" bg="$background" p="$5">
      <Card
        w="100%"
        maxWidth={460}
        p="$6"
        ai="center"
        borderWidth={1}
        borderColor="gray5"
        br="$5"
        gap="$4"
      >
        {/* Logo Icon */}
        <YStack
          w={72}
          h={72}
          br="$10"
          bg="blue10"
          jc="center"
          ai="center"
          mb="$1"
        >
          <Ticket color="#ffffff" size={36} />
        </YStack>

        {/* Tiêu đề & Slogan */}
        <YStack ai="center" gap="$1.5">
          <Text fontSize="$9" fontWeight="900" color="blue10" ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$4" color="gray11" ta="center" fontWeight="500">
            Đặt vé du lịch thông minh cùng Trợ lý AI
          </Text>
        </YStack>

        {/* 3 tính năng nổi bật */}
        <YStack gap="$3" w="100%" mt="$2">
          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="gray3">
            <Text fontSize="$6">✈️</Text>
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold">Đa dạng phương tiện</Text>
              <Text fontSize="$2" color="gray10">Máy bay, Xe khách limousine, Tàu hỏa Bắc - Nam</Text>
            </YStack>
          </XStack>

          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="gray3">
            <Sparkles color="#0066FF" size={24} />
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold">Trợ lý AI Săn vé & Lịch trình</Text>
              <Text fontSize="$2" color="gray10">Tư vấn chuyến đi phù hợp theo thời gian & túi tiền</Text>
            </YStack>
          </XStack>

          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="gray3">
            <Text fontSize="$6">🎟️</Text>
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold">Sơ đồ chọn ghế & Vé QR</Text>
              <Text fontSize="$2" color="gray10">Chọn ghế trực quan, xuất vé điện tử check-in nhanh</Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Nút hành động chính */}
        <Button
          w="100%"
          size="lg"
          mt="$3"
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          br="$4"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            Bắt đầu trải nghiệm ➔
          </Text>
        </Button>

        <Text fontSize="$2" color="gray10" ta="center">
          Ứng dụng Di động - Khoa CNTT - Đại học Công nghiệp TP.HCM
        </Text>
      </Card>
    </YStack>
  );
}
