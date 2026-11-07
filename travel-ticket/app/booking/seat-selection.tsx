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
  const { selectedTicket, selectedSeats, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

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
    if (bookedSeats.includes(seat)) {
      return;
    }
    dispatch(toggleSeat(seat));
  };

  const getVehicleDetails = () => {
    switch (selectedTicket?.type) {
      case 'flight':
        return {
          title: '✈️ Sơ đồ chỗ ngồi Máy bay',
          sub: 'Airbus A321 • Ghế cửa sổ & Ghế lối đi',
        };
      case 'train':
        return {
          title: '🚆 Sơ đồ Toa Giường nằm Tàu hỏa',
          sub: 'Khoang 4 Giường nằm mềm • Hành lang ngắm cảnh',
        };
      case 'bus':
      default:
        return {
          title: '🚌 Sơ đồ Phòng nằm Limousine',
          sub: 'Cabin VIP • Tầng 1 (Dưới) & Tầng 2 (Trên)',
        };
    }
  };

  const vehicleInfo = getVehicleDetails();

  return (
    <YStack f={1} bg="$background" jc="space-between" pt={insets.top > 0 ? insets.top : 12}>
      {/* Header điều hướng */}
      <XStack
        ai="center"
        jc="space-between"
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor={isDark ? '#334155' : '#E2E8F0'}
        bg="$background"
      >
        <Button
          size="sm"
          bg={isDark ? '#1E293B' : '#F1F5F9'}
          br="$10"
          px="$3"
          onPress={() => router.back()}
        >
          <Text color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold" fontSize="$3">
            ❮ Quay lại
          </Text>
        </Button>

        <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
          Chọn chỗ ngồi
        </Text>

        <YStack w={75} />
      </XStack>

      <ScrollView f={1} px="$3" pt="$2.5" showsVerticalScrollIndicator={false}>
        <YStack gap="$3" ai="center" pb="$4">
          <Card
            p="$3.5"
            w="100%"
            maxWidth={420}
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$1.5"
          >
            <XStack jc="space-between" ai="center">
              <Text fontSize="$5" fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
                {selectedTicket?.from || 'TP.HCM'} ➔ {selectedTicket?.to || 'Đà Lạt'}
              </Text>
              <YStack
                px="$2"
                py="$0.5"
                br="$3"
                bg={isDark ? '#1E3A8A' : '#EFF6FF'}
                borderWidth={1}
                borderColor={isDark ? '#1D4ED8' : '#BFDBFE'}
              >
                <Text color={isDark ? '#93C5FD' : '#1D4ED8'} fontSize="$2" fontWeight="bold">
                  {selectedTicket?.code || 'FUTA-01'}
                </Text>
              </YStack>
            </XStack>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">
              Hãng: <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{selectedTicket?.brand || 'Phương Trang'}</Text>
            </Text>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">
              Đã khóa: <Text fontWeight="bold" color="#DC2626">{bookedSeats.length}</Text> chỗ • Còn trống:{' '}
              <Text fontWeight="bold" color="#16A34A">
                {Math.max(0, (selectedTicket?.totalSeats || 12) - bookedSeats.length)} / {selectedTicket?.totalSeats || 12}
              </Text>{' '}
              chỗ
            </Text>
          </Card>

          {/* Tiêu đề sơ đồ trực quan */}
          <YStack ai="center" gap="$0.5">
            <Text fontSize="$5" fontWeight="800" ta="center" color={isDark ? '#F8FAFC' : '#0F172A'}>
              {vehicleInfo.title}
            </Text>
            <Text fontSize="$2.5" color={isDark ? '#94A3B8' : '#64748B'} ta="center">
              {vehicleInfo.sub}
            </Text>
          </YStack>

          {/* Sơ đồ chỗ ngồi chuyên biệt theo loại phương tiện */}
          <SeatMap
            vehicleType={selectedTicket?.type || 'bus'}
            vehicleName={selectedTicket?.brand || selectedTicket?.code || ''}
            bookedSeats={bookedSeats}
            selectedSeats={validSelectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </YStack>
      </ScrollView>

      {/* Tóm tắt thanh bên dưới */}
      <Card
        p="$3.5"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        br="$5"
        gap="$2"
        mx="$3"
        mt="$1"
        mb={Math.max(insets.bottom, 12)}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
      >
        <XStack jc="space-between" ai="center">
          <Text fontSize="$3.5" color={isDark ? '#94A3B8' : '#64748B'}>Chỗ đang chọn:</Text>
          <Text fontSize="$4" fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
            {validSelectedSeats.length > 0 ? validSelectedSeats.join(', ') : 'Chưa chọn'}
          </Text>
        </XStack>

        <XStack jc="space-between" ai="center">
          <Text fontSize="$4.5" fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>Tổng thanh toán:</Text>
          <Text fontSize="$6" fontWeight="900" color={isDark ? '#F87171' : '#DC2626'}>
            {totalPrice.toLocaleString('vi-VN')} đ
          </Text>
        </XStack>

        <Button
          height={48}
          bg="#0066FF"
          br="$4"
          disabled={validSelectedSeats.length === 0}
          opacity={validSelectedSeats.length === 0 ? 0.5 : 1}
          onPress={() => router.push('/booking/checkout')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$3.5">
            Xác nhận & Thanh toán ({validSelectedSeats.length} chỗ) ➔
          </Text>
        </Button>
      </Card>
    </YStack>
  );
}
