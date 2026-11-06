import React, { useMemo } from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSeat } from '../../store/bookingSlice';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { SeatMap } from '../../components/SeatMap';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SeatSelectionScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { selectedTicket, selectedSeats } = useSelector((state: RootState) => state.booking);

  // Lấy toàn bộ bookings từ server / local memory để xác định ghế đã được đặt
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: ticketService.getAllBookings,
  });

  // Gộp tất cả ghế đã đặt từ thông tin chuyến đi và các đơn booking thành công
  const bookedSeats: string[] = useMemo(() => {
    const seatSet = new Set<string>(selectedTicket?.bookedSeats || []);

    bookings.forEach((b: any) => {
      const isMatch =
        (b.ticketId && String(b.ticketId) === String(selectedTicket?.id)) ||
        (b.ticketCode && b.ticketCode === selectedTicket?.code);
      if (isMatch && b.status !== 'Cancelled') {
        const seats: string[] = Array.isArray(b.seats) ? b.seats : [b.seats];
        seats.forEach((s) => {
          if (s) seatSet.add(s);
        });
      }
    });

    return Array.from(seatSet);
  }, [selectedTicket, bookings]);

  // Lọc chỉ những ghế người dùng đang chọn mà CHƯA bị ai đặt trước
  const validSelectedSeats = useMemo(() => {
    return selectedSeats.filter((seat) => !bookedSeats.includes(seat));
  }, [selectedSeats, bookedSeats]);

  const ticketPrice = Number(selectedTicket?.price || 300000);
  const totalPrice = validSelectedSeats.length * ticketPrice;

  const handleToggleSeat = (seat: string) => {
    // Nếu ghế đã có người đặt -> không cho chọn
    if (bookedSeats.includes(seat)) {
      return;
    }
    dispatch(toggleSeat(seat));
  };

  return (
    <YStack f={1} bg="$background" jc="space-between" pt={insets.top > 0 ? insets.top : 12}>
      {/* Header điều hướng */}
      <XStack
        ai="center"
        jc="space-between"
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="gray5"
        bg="$background"
      >
        <Button
          size="sm"
          bg="gray3"
          pressStyle={{ bg: 'gray5' }}
          br="$10"
          px="$3"
          onPress={() => router.back()}
        >
          <Text color="#0066FF" fontWeight="bold" fontSize="$3">
            ❮ Quay lại
          </Text>
        </Button>

        <Text fontSize="$5" fontWeight="bold" color="$color">
          Chọn chỗ ngồi
        </Text>

        <YStack w={75} />
      </XStack>

      <ScrollView f={1} px="$4" pt="$3">
        <YStack gap="$4" ai="center">
          <Card
            p="$4"
            w="100%"
            borderWidth={1}
            borderColor="gray5"
            br="$5"
            gap="$1.5"
          >
            <XStack jc="space-between" ai="center">
              <Text fontSize="$5" fontWeight="800" color="$color">
                {selectedTicket?.from || 'TP.HCM'} ➔ {selectedTicket?.to || 'Đà Lạt'}
              </Text>
              <YStack px="$2" py="$0.5" br="$3" bg="blue3">
                <Text color="blue10" fontSize="$2" fontWeight="bold">
                  {selectedTicket?.code || 'FUTA-01'}
                </Text>
              </YStack>
            </XStack>
            <Text color="gray11" fontSize="$3">
              Hãng: <Text fontWeight="600" color="$color">{selectedTicket?.brand || 'Phương Trang'}</Text>
            </Text>
            <Text color="gray10" fontSize="$2">
              Đã khóa: {bookedSeats.length} ghế • Còn trống: {Math.max(0, 12 - bookedSeats.length)} ghế
            </Text>
          </Card>

          <Text fontSize="$6" fontWeight="bold" ta="center">
            Sơ đồ chọn chỗ ngồi
          </Text>

          <SeatMap
            bookedSeats={bookedSeats}
            selectedSeats={validSelectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </YStack>
      </ScrollView>

      {/* Tóm tắt thanh bên dưới */}
      <Card
        p="$4"
        borderWidth={1}
        borderColor="gray5"
        br="$5"
        gap="$2.5"
        mx="$4"
        mt="$1"
        mb={Math.max(insets.bottom, 12)}
        bg="$background"
      >
        <XStack jc="space-between" ai="center">
          <Text fontSize="$4" color="gray11">Ghế đang chọn:</Text>
          <Text fontSize="$4" fontWeight="800" color="blue10">
            {validSelectedSeats.length > 0 ? validSelectedSeats.join(', ') : 'Chưa chọn'}
          </Text>
        </XStack>

        <XStack jc="space-between" ai="center">
          <Text fontSize="$5" fontWeight="600">Tổng thanh toán:</Text>
          <Text fontSize="$7" fontWeight="900" color="red10">
            {totalPrice.toLocaleString('vi-VN')} đ
          </Text>
        </XStack>

        <Button
          size="lg"
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          br="$4"
          disabled={validSelectedSeats.length === 0}
          opacity={validSelectedSeats.length === 0 ? 0.5 : 1}
          onPress={() => router.push('/booking/checkout')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            Xác nhận & Thanh toán ({validSelectedSeats.length} ghế) ➔
          </Text>
        </Button>
      </Card>
    </YStack>
  );
}
