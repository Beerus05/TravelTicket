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
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <Text fontSize="$6" fontWeight="bold">Thông tin hành trình</Text>
          <Text fontSize="$4" color="$blue10">
            {selectedTicket?.brand} ({selectedTicket?.code})
          </Text>
          <Text fontSize="$5" fontWeight="600">
            {selectedTicket?.from} ➔ {selectedTicket?.to}
          </Text>
          <Text color="$gray10">Giờ đi: {selectedTicket?.departureTime}</Text>
          <Text color="$gray10">Ghế đã chọn: {selectedSeats.join(', ') || 'Chưa chọn'}</Text>
        </Card>

        {/* Thông tin liên hệ */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$3"
        >
          <Text fontSize="$5" fontWeight="bold">Thông tin liên hệ</Text>
          <Text color="$gray11">Họ tên: {user?.name || 'Khách hàng'}</Text>
          <Text color="$gray11">Email: {user?.email || 'phi@student.iuh.edu.vn'}</Text>
          <Input
            placeholder="Số điện thoại nhận vé"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            size="$4"
          />
        </Card>

        {/* Mã giảm giá */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <Text fontSize="$5" fontWeight="bold">Mã ưu đãi / Voucher</Text>
          <XStack gap="$2">
            <Input
              f={1}
              placeholder="Nhập TRAVEL50 hoặc IUH"
              value={voucher}
              onChangeText={setVoucher}
              autoCapitalize="characters"
            />
            <Button theme="active" size="md" onPress={handleApplyVoucher}>
              Áp dụng
            </Button>
          </XStack>
          {discount > 0 && (
            <Text color="$green10" fontSize="$3">
              ✓ Đã áp dụng mã giảm giá {discount.toLocaleString('vi-VN')} đ!
            </Text>
          )}
        </Card>

        {/* Tóm tắt thanh toán */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <XStack jc="space-between">
            <Text color="$gray10">Tạm tính ({selectedSeats.length} vé):</Text>
            <Text>{subtotal.toLocaleString('vi-VN')} đ</Text>
          </XStack>
          {discount > 0 && (
            <XStack jc="space-between">
              <Text color="$green10">Giảm giá voucher:</Text>
              <Text color="$green10">-{discount.toLocaleString('vi-VN')} đ</Text>
            </XStack>
          )}
          <Separator my="$2" />
          <XStack jc="space-between" ai="center">
            <Text fontSize="$6" fontWeight="bold">Tổng tiền:</Text>
            <Text fontSize="$7" fontWeight="bold" color="$red10">
              {finalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </XStack>
        </Card>

        {/* Nút thanh toán */}
        <Button
          size="lg"
          theme="active"
          onPress={handleConfirm}
          disabled={createBookingMutation.isPending || selectedSeats.length === 0}
        >
          {createBookingMutation.isPending ? (
            <XStack gap="$2" ai="center">
              <Spinner color="white" />
              <Text color="white">Đang xử lý đơn hàng...</Text>
            </XStack>
          ) : (
            'Thanh toán & Xuất vé điện tử ➔'
          )}
        </Button>
      </YStack>
    </ScrollView>
  );
}
