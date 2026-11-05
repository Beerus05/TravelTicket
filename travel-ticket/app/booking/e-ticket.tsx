import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, ScrollView } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { CheckCircle, QrCode } from '../../components/Icons';

export default function ETicketScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await ticketService.getBookingById(String(bookingId));
    },
    enabled: !!bookingId,
  });

  return (
    <ScrollView f={1} bg="$background" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Card
        w="100%"
        maxWidth={440}
        p="$5"
        borderWidth={1}
        borderColor="gray5"
        br="$4"
        gap="$3"
        ai="center"
      >
        <CheckCircle size={56} color="#10B981" />
        <Text fontSize="$7" fontWeight="bold" color="green10">
          Đặt vé thành công!
        </Text>
        <Text color="gray10" ta="center">
          Vui lòng xuất trình mã vé điện tử bên dưới cho nhân viên soát vé khi lên xe hoặc qua cửa an ninh.
        </Text>

        <Separator my="$2" w="100%" />

        <YStack w="100%" gap="$2">
          <XStack jc="space-between">
            <Text color="gray10">Mã đặt chỗ:</Text>
            <Text fontWeight="bold">#{booking?.id || bookingId || '8899'}</Text>
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
            <Text fontWeight="bold">{booking?.departureTime || '08:00 - 15/11/2026'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Hành khách:</Text>
            <Text fontWeight="bold">{booking?.passengerName || 'Nguyễn Đình Phi'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Số ghế:</Text>
            <Text fontWeight="bold" color="blue10">
              {Array.isArray(booking?.seats) ? booking.seats.join(', ') : (booking?.seats || 'A1')}
            </Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Tổng tiền đã thanh toán:</Text>
            <Text fontWeight="bold" color="red10">
              {Number(booking?.totalPrice || 320000).toLocaleString('vi-VN')} đ
            </Text>
          </XStack>
        </YStack>

        {/* Khung giả lập QR Code */}
        <YStack p="$4" bg="gray3" br="$4" mt="$3" ai="center" gap="$1" w="100%">
          <QrCode size={110} color="#000" />
          <Text fontSize="$2" color="gray11">
            TRAVEL-TICKET-{bookingId || 'VERIFIED'}
          </Text>
        </YStack>

        <Button
          w="100%"
          mt="$4"
          size="md"
          theme="active"
          onPress={() => router.replace('/(tabs)/my-tickets')}
        >
          Xem danh sách Vé của tôi
        </Button>

        <Button
          w="100%"
          bg="transparent"
          borderWidth={0}
          onPress={() => router.replace('/(tabs)/home')}
        >
          Về trang chủ
        </Button>
      </Card>
    </ScrollView>
  );
}
