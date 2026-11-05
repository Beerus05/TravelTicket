import React from 'react';
import { YStack, XStack, Text, Card, Button, ScrollView, Spinner } from 'tamagui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { useRouter } from 'expo-router';

export default function MyTicketsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: ticketService.getAllBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      await ticketService.cancelBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="blue10" />
        <Text mt="$2" color="gray10">Đang tải danh sách vé đã đặt...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView f={1} p="$4" bg="$background">
      <YStack gap="$3">
        {bookings.length === 0 ? (
          <Card
            p="$6"
            ai="center"
            gap="$3"
            borderWidth={1}
            borderColor="gray5"
            br="$4"
            mt="$4"
          >
            <Text fontSize="$6" fontWeight="bold">Bạn chưa có vé nào</Text>
            <Text color="gray10" ta="center">
              Hãy khám phá các chuyến đi ưu đãi và đặt chuyến đi đầu tiên ngay!
            </Text>
            <Button size="md" theme="active" onPress={() => router.push('/(tabs)/home')}>
              Tìm chuyến đi ngay
            </Button>
          </Card>
        ) : (
          bookings.map((b: any) => (
            <Card
              key={b.id}
              p="$4"
              borderWidth={1}
              borderColor="gray5"
              br="$4"
              gap="$2"
            >
              <XStack jc="space-between" ai="center">
                <Text fontWeight="bold" fontSize="$5">{b.route}</Text>
                <Text
                  color={b.status === 'Cancelled' ? 'red10' : 'green10'}
                  fontWeight="bold"
                >
                  {b.status || 'Confirmed'}
                </Text>
              </XStack>

              <Text color="gray11">
                Hành khách: <Text fontWeight="bold">{b.passengerName || 'Hành khách'}</Text>
              </Text>
              <Text color="gray11">
                Mã chuyến: {b.ticketCode} | Ghế: {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
              </Text>
              <Text color="gray11">Khởi hành: {b.departureTime}</Text>
              <Text fontWeight="bold" color="red10" fontSize="$4" mt="$1">
                Tổng: {Number(b.totalPrice).toLocaleString('vi-VN')} đ
              </Text>

              <XStack gap="$2" mt="$2">
                <Button
                  size="sm"
                  theme="active"
                  f={1}
                  onPress={() => router.push({ pathname: '/booking/e-ticket', params: { bookingId: b.id } })}
                >
                  Xem vé điện tử
                </Button>
                <Button
                  size="sm"
                  theme={b.status === 'Cancelled' ? undefined : 'red'}
                  bg={b.status === 'Cancelled' ? 'gray4' : undefined}
                  f={1}
                  disabled={b.status === 'Cancelled' || cancelMutation.isPending}
                  opacity={b.status === 'Cancelled' ? 0.5 : 1}
                  onPress={() => cancelMutation.mutate(b.id)}
                >
                  {b.status === 'Cancelled' ? 'Đã hủy' : 'Hủy vé'}
                </Button>
              </XStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
}
