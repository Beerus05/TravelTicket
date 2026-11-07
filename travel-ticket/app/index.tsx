import React from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui';
import { useRouter } from 'expo-router';
import { Ticket, Sparkles } from '../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        maxWidth={440}
        p="$4"
        ai="center"
        borderWidth={1}
        borderColor="#E2E8F0"
        br="$5"
        gap="$3.5"
        bg="#FFFFFF"
      >
        {/* Logo Icon */}
        <YStack
          w={60}
          h={60}
          br="$10"
          bg="#0066FF"
          jc="center"
          ai="center"
          mt="$1"
        >
          <Ticket color="#ffffff" size={30} />
        </YStack>

        {/* Tiêu đề & Slogan */}
        <YStack ai="center" gap="$1">
          <Text fontSize="$8" fontWeight="900" color="#0066FF" letterSpacing={0.5} ta="center">
            TRAVEL TICKET
          </Text>
          <Text fontSize="$3" color="#64748B" ta="center" fontWeight="500">
            Đặt vé du lịch thông minh cùng Trợ lý AI
          </Text>
        </YStack>

        {/* 3 tính năng nổi bật */}
        <YStack gap="$2.5" w="100%" mt="$1">
          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="#F1F5F9">
            <Text fontSize="$5">✈️</Text>
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold" color="#0F172A">Đa dạng phương tiện</Text>
              <Text fontSize="$2.5" color="#64748B">Máy bay, Xe khách Limousine, Tàu hỏa Bắc - Nam</Text>
            </YStack>
          </XStack>

          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="#F1F5F9">
            <Sparkles color="#0066FF" size={22} />
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold" color="#0F172A">Trợ lý AI Đa Tác Nhân</Text>
              <Text fontSize="$2.5" color="#64748B">Lập lịch trình tour, săn vé rẻ, tư vấn ghế & voucher</Text>
            </YStack>
          </XStack>

          <XStack ai="center" gap="$3" p="$2.5" br="$3" bg="#F1F5F9">
            <Text fontSize="$5">🎟️</Text>
            <YStack f={1}>
              <Text fontSize="$3" fontWeight="bold" color="#0F172A">Sơ đồ chọn ghế & Vé QR</Text>
              <Text fontSize="$2.5" color="#64748B">Chọn ghế trực quan, xuất vé điện tử check-in nhanh</Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Nút hành động chính */}
        <Button
          w="100%"
          height={48}
          mt="$2"
          bg="#0066FF"
          br="$4"
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$3.5">
            Bắt đầu trải nghiệm ➔
          </Text>
        </Button>

        {/* Thông tin sinh viên thực hiện IUH */}
        <YStack ai="center" gap="$1" pt="$1">
          <Text fontSize="$2" color="#64748B" ta="center">
            SV1: <Text fontWeight="700" color="#0F172A">Nguyễn Đình Phi</Text> (21012345)
          </Text>
          <Text fontSize="$2" color="#64748B" ta="center">
            SV2: <Text fontWeight="700" color="#0F172A">Vũ Trần Đức Nghĩa</Text> (23637711) • IUH
          </Text>
        </YStack>
      </Card>
    </ScrollView>
  );
}
