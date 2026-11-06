import React, { useState } from 'react';
import { YStack, XStack, Input, Text, Button, Card, Spinner, ScrollView, Separator } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearBookingDraft, addBookedSeatsToTicket } from '../../store/bookingSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { user, selectedTicket, selectedSeats, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

  const [phone, setPhone] = useState('0901234567');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = selectedSeats.length * Number(selectedTicket?.price || 300000);
  const finalPrice = Math.max(0, subtotal - discount);

  const handleApplyVoucher = () => {
    if (voucher.trim().toUpperCase() === 'TRAVEL50') {
      setDiscount(50000);
    } else if (voucher.trim().toUpperCase() === 'IUH') {
      setDiscount(100000);
    } else {
      setDiscount(0);
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: async (newBooking: any) => {
      return await ticketService.createBooking(newBooking);
    },
    onSuccess: (data) => {
      if (selectedTicket) {
        dispatch(addBookedSeatsToTicket({ ticketId: selectedTicket.id, seats: selectedSeats }));
      }
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      dispatch(clearBookingDraft());
      router.replace({ pathname: '/booking/e-ticket', params: { bookingId: data.id } });
    },
  });

  const handleConfirm = () => {
    if (!selectedTicket) return;

    createBookingMutation.mutate({
      ticketId: selectedTicket.id,
      ticketCode: selectedTicket.code,
      route: `${selectedTicket.from} ➔ ${selectedTicket.to}`,
      departureTime: selectedTicket.departureTime,
      passengerName: user?.name || 'Hành khách',
      passengerEmail: user?.email || '',
      passengerPhone: phone,
      seats: selectedSeats,
      totalPrice: finalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <YStack f={1} bg="$background" pt={insets.top > 0 ? insets.top : 12}>
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
          pressStyle={{ bg: isDark ? '#334155' : '#E2E8F0' }}
          br="$10"
          px="$3"
          onPress={() => router.back()}
        >
          <Text color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold" fontSize="$3">
            ❮ Quay lại
          </Text>
        </Button>

        <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
          Xác nhận & Thanh toán
        </Text>

        <YStack w={75} />
      </XStack>

      <ScrollView f={1} px="$4" pt="$3" showsVerticalScrollIndicator={false}>
        <YStack gap="$4" pb={Math.max(insets.bottom + 20, 32)}>
          {/* Tóm tắt chuyến đi */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$2"
          >
            <XStack jc="space-between" ai="center">
              <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>1. Thông tin hành trình</Text>
              <YStack
                px="$2"
                py="$0.5"
                br="$3"
                bg={isDark ? '#1E3A8A' : '#EFF6FF'}
                borderWidth={1}
                borderColor={isDark ? '#1D4ED8' : '#BFDBFE'}
              >
                <Text fontSize="$2" fontWeight="bold" color={isDark ? '#93C5FD' : '#1D4ED8'}>
                  {selectedTicket?.code}
                </Text>
              </YStack>
            </XStack>
            <Text fontSize="$4" color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="600">
              {selectedTicket?.brand}
            </Text>
            <Text fontSize="$6" fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
              {selectedTicket?.from} ➔ {selectedTicket?.to}
            </Text>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">🕒 Giờ đi: {selectedTicket?.departureTime}</Text>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">
              💺 Ghế đã chọn: <Text fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'}>{selectedSeats.join(', ') || 'Chưa chọn'}</Text>
            </Text>
          </Card>

          {/* Thông tin liên hệ */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$3"
          >
            <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>2. Thông tin hành khách</Text>
            <XStack jc="space-between">
              <Text color={isDark ? '#94A3B8' : '#64748B'}>Họ và tên:</Text>
              <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{user?.name || 'Hành khách'}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color={isDark ? '#94A3B8' : '#64748B'}>Email:</Text>
              <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{user?.email || 'Chưa cập nhật'}</Text>
            </XStack>
            <YStack gap="$1">
              <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Số điện thoại nhận vé:</Text>
              <Input
                placeholder="Nhập số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                size="$4"
                br="$3"
                bg={isDark ? '#0F172A' : '#FFFFFF'}
                borderColor={isDark ? '#334155' : '#CBD5E1'}
                color={isDark ? '#F8FAFC' : '#0F172A'}
                placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              />
            </YStack>
          </Card>

          {/* Mã giảm giá */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$2"
          >
            <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>3. Mã ưu đãi / Voucher</Text>
            <XStack gap="$2">
              <Input
                f={1}
                placeholder="Nhập TRAVEL50 hoặc IUH"
                value={voucher}
                onChangeText={setVoucher}
                autoCapitalize="characters"
                br="$3"
                bg={isDark ? '#0F172A' : '#FFFFFF'}
                borderColor={isDark ? '#334155' : '#CBD5E1'}
                color={isDark ? '#F8FAFC' : '#0F172A'}
                placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              />
              <Button
                bg="#0066FF"
                pressStyle={{ bg: '#0052CC' }}
                size="md"
                br="$3"
                onPress={handleApplyVoucher}
              >
                <Text color="#FFFFFF" fontWeight="bold">Áp dụng</Text>
              </Button>
            </XStack>
            {discount > 0 && (
              <Text color={isDark ? '#4ADE80' : '#16A34A'} fontSize="$3" fontWeight="600">
                ✓ Đã áp dụng mã giảm giá {discount.toLocaleString('vi-VN')} đ!
              </Text>
            )}
          </Card>

          {/* Tóm tắt thanh toán */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$2.5"
          >
            <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>4. Chi tiết thanh toán</Text>
            <XStack jc="space-between">
              <Text color={isDark ? '#94A3B8' : '#64748B'}>Tạm tính ({selectedSeats.length} vé):</Text>
              <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{subtotal.toLocaleString('vi-VN')} đ</Text>
            </XStack>
            {discount > 0 && (
              <XStack jc="space-between">
                <Text color={isDark ? '#4ADE80' : '#16A34A'}>Giảm giá voucher:</Text>
                <Text color={isDark ? '#4ADE80' : '#16A34A'} fontWeight="600">-{discount.toLocaleString('vi-VN')} đ</Text>
              </XStack>
            )}
            <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$1" />
            <XStack jc="space-between" ai="center">
              <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>Tổng thanh toán:</Text>
              <Text fontSize="$7" fontWeight="900" color={isDark ? '#F87171' : '#DC2626'}>
                {finalPrice.toLocaleString('vi-VN')} đ
              </Text>
            </XStack>
          </Card>

          {/* Nút thanh toán */}
          <Button
            size="lg"
            bg="#0066FF"
            pressStyle={{ bg: '#0052CC' }}
            br="$4"
            onPress={handleConfirm}
            disabled={createBookingMutation.isPending || selectedSeats.length === 0}
            opacity={selectedSeats.length === 0 ? 0.6 : 1}
          >
            {createBookingMutation.isPending ? (
              <XStack gap="$2" ai="center">
                <Spinner color="white" />
                <Text color="#FFFFFF" fontWeight="bold">Đang xử lý xuất vé...</Text>
              </XStack>
            ) : (
              <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
                Thanh toán & Xuất vé điện tử ➔
              </Text>
            )}
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
