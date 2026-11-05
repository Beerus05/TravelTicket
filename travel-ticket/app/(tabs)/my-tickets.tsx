import React from 'react';
import { YStack, XStack, Text, Card, Button, ScrollView, Spinner, Separator } from 'tamagui';
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
        <Text fontSize="$6" fontWeight="bold">
          Vé đã đặt ({bookings.length})
        </Text>

        {bookings.length === 0 ? (
          <Card
            p="$6"
            ai="center"
            gap="$3"
            borderWidth={1}
            borderColor="gray5"
            br="$5"
            mt="$4"
          >
            <Text fontSize="$8">🎫</Text>
            <Text fontSize="$6" fontWeight="bold">Bạn chưa có vé nào</Text>
            <Text color="gray10" ta="center">
              Khám phá các chuyến đi ưu đãi và đặt chuyến đi đầu tiên ngay hôm nay!
            </Text>
            <Button
              size="md"
              bg="#0066FF"
              pressStyle={{ bg: '#0052CC' }}
              br="$4"
              onPress={() => router.push('/(tabs)/home')}
            >
              <Text color="#FFFFFF" fontWeight="bold">
                Tìm chuyến đi ngay ➔
              </Text>
            </Button>
          </Card>
        ) : (
          bookings.map((b: any) => {
            const isCancelled = b.status === 'Cancelled';
            return (
              <Card
                key={b.id}
                p="$4"
                borderWidth={1}
                borderColor="gray5"
                br="$5"
                gap="$2.5"
              >
                {/* Hàng tiêu đề & Trạng thái */}
                <XStack jc="space-between" ai="center">
                  <Text fontWeight="800" fontSize="$5" color="$color">
                    {b.route}
                  </Text>
                  <YStack
                    px="$2.5"
                    py="$1"
                    br="$10"
                    bg={isCancelled ? 'red3' : 'green3'}
                  >
                    <Text
                      color={isCancelled ? 'red10' : 'green10'}
                      fontWeight="bold"
                      fontSize="$2"
                    >
                      {isCancelled ? '✕ Đã hủy' : '✓ Đã xác nhận'}
                    </Text>
                  </YStack>
                </XStack>

                {/* Thông tin vé */}
                <YStack gap="$1">
                  <XStack jc="space-between">
                    <Text color="gray10" fontSize="$3">Hành khách:</Text>
                    <Text fontWeight="600" fontSize="$3">{b.passengerName || 'Khách hàng'}</Text>
                  </XStack>
                  <XStack jc="space-between">
                    <Text color="gray10" fontSize="$3">Mã chuyến & Ghế:</Text>
                    <Text fontWeight="bold" color="blue10" fontSize="$3">
                      {b.ticketCode} (Ghế {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats})
                    </Text>
                  </XStack>
                  <XStack jc="space-between">
                    <Text color="gray10" fontSize="$3">Giờ khởi hành:</Text>
                    <Text fontWeight="500" fontSize="$3">{b.departureTime}</Text>
                  </XStack>
                  <XStack jc="space-between" ai="center" mt="$1">
                    <Text color="gray10" fontSize="$3">Tổng thanh toán:</Text>
                    <Text fontWeight="800" color="red10" fontSize="$5">
                      {Number(b.totalPrice).toLocaleString('vi-VN')} đ
                    </Text>
                  </XStack>
                </YStack>

                <Separator borderColor="gray4" my="$1" />

                {/* Nút tác vụ */}
                <XStack gap="$2" mt="$1">
                  <Button
                    size="sm"
                    bg="#0066FF"
                    pressStyle={{ bg: '#0052CC' }}
                    f={1}
                    br="$3"
                    onPress={() => router.push({ pathname: '/booking/e-ticket', params: { bookingId: b.id } })}
                  >
                    <Text color="#FFFFFF" fontWeight="bold" fontSize="$3">
                      🎟️ Xem vé QR
                    </Text>
                  </Button>

                  <Button
                    size="sm"
                    bg={isCancelled ? '#F1F5F9' : '#DC2626'}
                    pressStyle={{ bg: isCancelled ? '#F1F5F9' : '#B91C1C' }}
                    borderWidth={1}
                    borderColor={isCancelled ? '#CBD5E1' : '#DC2626'}
                    f={1}
                    br="$3"
                    disabled={isCancelled || cancelMutation.isPending}
                    opacity={isCancelled ? 0.6 : 1}
                    onPress={() => cancelMutation.mutate(b.id)}
                  >
                    <Text
                      color={isCancelled ? '#64748B' : '#FFFFFF'}
                      fontWeight="bold"
                      fontSize="$3"
                    >
                      {isCancelled ? '✕ Đã hủy' : '🗑️ Hủy vé'}
                    </Text>
                  </Button>
                </XStack>
              </Card>
            );
          })
        )}
      </YStack>
    </ScrollView>
  );
}
