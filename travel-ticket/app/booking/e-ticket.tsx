import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, ScrollView } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { CheckCircle, QrCode } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ETicketScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await ticketService.getBookingById(String(bookingId));
    },
    enabled: !!bookingId,
  });

  return (
    <ScrollView
      f={1}
      bg="$background"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Math.max(insets.top + 16, 32),
        paddingBottom: Math.max(insets.bottom + 16, 32),
      }}
    >
      <Card
        w="100%"
        maxWidth={440}
        p="$5"
        borderWidth={1}
        borderColor="gray5"
        br="$5"
        gap="$3"
        ai="center"
      >
        <CheckCircle size={56} color="#10B981" />
        <Text fontSize="$7" fontWeight="900" color="green10">
          Đặt vé thành công!
        </Text>
        <Text color="gray10" ta="center" fontSize="$3">
          Vui lòng xuất trình vé điện tử hoặc mã QR dưới đây khi lên phương tiện
        </Text>

        <Separator borderColor="gray4" my="$1" w="100%" />

        <YStack w="100%" gap="$2.5">
          <XStack jc="space-between">
            <Text color="gray10">Mã đặt chỗ:</Text>
            <Text fontWeight="800">#{booking?.id || bookingId || '8899'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Hành trình:</Text>
            <Text fontWeight="bold">{booking?.route || 'TP.HCM ➔ Đà Lạt'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Mã chuyến:</Text>
            <Text fontWeight="bold" color="blue10">{booking?.ticketCode || 'FUTA-DL01'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Giờ khởi hành:</Text>
            <Text fontWeight="600">{booking?.departureTime || '08:00 - 15/11/2026'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Hành khách:</Text>
            <Text fontWeight="600">{booking?.passengerName || 'Nguyễn Đình Phi'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Số ghế ngồi:</Text>
            <Text fontWeight="900" color="blue10">
              {Array.isArray(booking?.seats) ? booking.seats.join(', ') : (booking?.seats || 'A1')}
            </Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Tổng tiền đã trả:</Text>
            <Text fontWeight="900" color="red10" fontSize="$5">
              {Number(booking?.totalPrice || 320000).toLocaleString('vi-VN')} đ
            </Text>
          </XStack>
        </YStack>

        {/* Khung giả lập QR Code */}
        <YStack p="$4" bg="white" br="$4" mt="$2" ai="center" gap="$2" w="100%" borderWidth={1} borderColor="gray5">
          <QrCode size={110} color="#000" />
          <Text fontSize="$2" color="gray11" fontWeight="600">
            MÃ VÉ: TRAVEL-TICKET-{bookingId || 'VERIFIED'}
          </Text>
        </YStack>

        <Button
          w="100%"
          mt="$3"
          size="lg"
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          br="$4"
          onPress={() => router.replace('/(tabs)/my-tickets')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            Xem danh sách Vé của tôi ➔
          </Text>
        </Button>

        <Button
          w="100%"
          bg="transparent"
          borderWidth={0}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text color="blue10" fontWeight="bold">Về trang chủ</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
