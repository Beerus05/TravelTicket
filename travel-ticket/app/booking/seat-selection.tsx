import React from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSeat } from '../../store/bookingSlice';
import { useRouter } from 'expo-router';
import { SeatMap } from '../../components/SeatMap';

export default function SeatSelectionScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedTicket, selectedSeats } = useSelector((state: RootState) => state.booking);

  const bookedSeats: string[] = selectedTicket?.bookedSeats || ['A1', 'B2'];
  const ticketPrice = Number(selectedTicket?.price || 300000);
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <YStack f={1} p="$4" bg="$background" jc="space-between">
      <ScrollView f={1}>
        <YStack gap="$4" ai="center">
          <Card
            p="$4"
            w="100%"
            borderWidth={1}
            borderColor="$gray5"
            br="$4"
            gap="$1"
          >
            <Text fontSize="$5" fontWeight="bold">
              Chuyến: {selectedTicket?.from || 'TP.HCM'} ➔ {selectedTicket?.to || 'Đà Lạt'}
            </Text>
            <Text color="$blue10">
              {selectedTicket?.brand || 'Phương Trang'} - Mã: {selectedTicket?.code || 'FUTA-01'}
            </Text>
          </Card>

          <Text fontSize="$6" fontWeight="bold" ta="center">
            Sơ đồ ghế ngồi
          </Text>

          <SeatMap
            bookedSeats={bookedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={(seat) => dispatch(toggleSeat(seat))}
          />
        </YStack>
      </ScrollView>

      {/* Tóm tắt thanh bên dưới */}
      <Card
        p="$4"
        borderWidth={1}
        borderColor="$gray5"
        br="$4"
        gap="$3"
      >
        <XStack jc="space-between" ai="center">
          <Text fontSize="$4" color="$gray11">Ghế đang chọn:</Text>
          <Text fontSize="$4" fontWeight="bold" color="$blue10">
            {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}
          </Text>
        </XStack>

        <XStack jc="space-between" ai="center">
          <Text fontSize="$5" fontWeight="600">Tổng thanh toán:</Text>
          <Text fontSize="$7" fontWeight="bold" color="$red10">
            {totalPrice.toLocaleString('vi-VN')} đ
          </Text>
        </XStack>

        <Button
          size="md"
          theme="active"
          disabled={selectedSeats.length === 0}
          opacity={selectedSeats.length === 0 ? 0.5 : 1}
          onPress={() => router.push('/booking/checkout')}
        >
          Xác nhận & Thanh toán ({selectedSeats.length} ghế)
        </Button>
      </Card>
    </YStack>
  );
}
