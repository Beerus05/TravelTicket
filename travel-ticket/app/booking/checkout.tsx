import React, { useState } from 'react';
import { YStack, XStack, Input, Text, Button, Card, Spinner, ScrollView, Separator } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { clearBookingDraft, addBookedSeatsToTicket } from '../../store/bookingSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { useRouter } from 'expo-router';

export default function CheckoutScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, selectedTicket, selectedSeats } = useSelector((state: RootState) => state.booking);

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
      passengerName: user?.name || 'Nguyễn Đình Phi',
      passengerPhone: phone,
      seats: selectedSeats,
      totalPrice: finalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView f={1} bg="$background" p="$4">
      <YStack gap="$4">
        {/* Tóm tắt chuyến đi */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="gray5"
          br="$5"
          gap="$2"
        >
          <XStack jc="space-between" ai="center">
            <Text fontSize="$5" fontWeight="bold">1. Thông tin hành trình</Text>
            <YStack px="$2" py="$0.5" br="$3" bg="blue3">
              <Text fontSize="$2" fontWeight="bold" color="blue10">
                {selectedTicket?.code}
              </Text>
            </YStack>
          </XStack>
          <Text fontSize="$4" color="blue10" fontWeight="600">
            {selectedTicket?.brand}
          </Text>
          <Text fontSize="$6" fontWeight="800" color="$color">
            {selectedTicket?.from} ➔ {selectedTicket?.to}
          </Text>
          <Text color="gray10" fontSize="$3">🕒 Giờ đi: {selectedTicket?.departureTime}</Text>
          <Text color="gray10" fontSize="$3">
            💺 Ghế đã chọn: <Text fontWeight="bold" color="blue10">{selectedSeats.join(', ') || 'Chưa chọn'}</Text>
          </Text>
        </Card>

        {/* Thông tin liên hệ */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="gray5"
          br="$5"
          gap="$3"
        >
          <Text fontSize="$5" fontWeight="bold">2. Thông tin hành khách</Text>
          <XStack jc="space-between">
            <Text color="gray10">Họ và tên:</Text>
            <Text fontWeight="600">{user?.name || 'Nguyễn Đình Phi'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color="gray10">Email:</Text>
            <Text fontWeight="600">{user?.email || 'phi@student.iuh.edu.vn'}</Text>
          </XStack>
          <YStack gap="$1">
            <Text color="gray10" fontSize="$3">Số điện thoại nhận vé:</Text>
            <Input
              placeholder="Nhập số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              size="$4"
              br="$3"
            />
          </YStack>
        </Card>

        {/* Mã giảm giá */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="gray5"
          br="$5"
          gap="$2"
        >
          <Text fontSize="$5" fontWeight="bold">3. Mã ưu đãi / Voucher</Text>
          <XStack gap="$2">
            <Input
              f={1}
              placeholder="Nhập TRAVEL50 hoặc IUH"
              value={voucher}
              onChangeText={setVoucher}
              autoCapitalize="characters"
              br="$3"
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
            <Text color="green10" fontSize="$3" fontWeight="600">
              ✓ Đã áp dụng mã giảm giá {discount.toLocaleString('vi-VN')} đ!
            </Text>
          )}
        </Card>

        {/* Tóm tắt thanh toán */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="gray5"
          br="$5"
          gap="$2.5"
        >
          <Text fontSize="$5" fontWeight="bold">4. Chi tiết thanh toán</Text>
          <XStack jc="space-between">
            <Text color="gray10">Tạm tính ({selectedSeats.length} vé):</Text>
            <Text fontWeight="600">{subtotal.toLocaleString('vi-VN')} đ</Text>
          </XStack>
          {discount > 0 && (
            <XStack jc="space-between">
              <Text color="green10">Giảm giá voucher:</Text>
              <Text color="green10" fontWeight="600">-{discount.toLocaleString('vi-VN')} đ</Text>
            </XStack>
          )}
          <Separator borderColor="gray4" my="$1" />
          <XStack jc="space-between" ai="center">
            <Text fontSize="$5" fontWeight="bold">Tổng thanh toán:</Text>
            <Text fontSize="$7" fontWeight="900" color="red10">
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
  );
}
