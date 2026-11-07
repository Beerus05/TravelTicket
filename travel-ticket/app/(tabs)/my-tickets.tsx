import React, { useMemo } from 'react';
import { YStack, XStack, Text, Card, Button, ScrollView, Spinner, Separator } from 'tamagui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ticketService } from '../../services/ticketService';
import { useRouter } from 'expo-router';

export default function MyTicketsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: ticketService.getAllBookings,
  });

  // Lọc chỉ hiển thị vé của tài khoản người dùng đang đăng nhập
  const userBookings = useMemo(() => {
    if (!user) return [];
    const userEmail = (user.email || '').trim().toLowerCase();
    const userName = (user.name || '').trim().toLowerCase();

    return bookings.filter((b: any) => {
      const bEmail = (b.passengerEmail || '').trim().toLowerCase();
      const bName = (b.passengerName || '').trim().toLowerCase();

      const matchEmail = Boolean(bEmail && userEmail && bEmail === userEmail);
      const matchName = Boolean(bName && userName && bName === userName);

      return matchEmail || matchName;
    });
  }, [bookings, user]);

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
        <Spinner size="large" color="#0066FF" />
        <Text mt="$2" color="#64748B">Đang tải danh sách vé đã đặt...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView
      f={1}
      bg="$background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <YStack gap="$3">
        <XStack jc="space-between" ai="center">
          <Text fontSize="$6" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
            Vé của tôi ({userBookings.length})
          </Text>
          <Text fontSize="$2" color={isDark ? '#94A3B8' : '#64748B'}>
            {user?.email || 'Tài khoản khách'}
          </Text>
        </XStack>

        {userBookings.length === 0 ? (
          <Card
            p="$6"
            ai="center"
            gap="$3"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            mt="$4"
          >
            <Text fontSize="$8">🎫</Text>
            <Text fontSize="$6" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>Bạn chưa có vé nào</Text>
            <Text color={isDark ? '#94A3B8' : '#64748B'} ta="center">
              Tài khoản này chưa đặt chuyến đi nào. Khám phá các chuyến đi ưu đãi và đặt chuyến đi đầu tiên ngay!
            </Text>
            <Button
              size="md"
              bg="#0066FF"
              br="$4"
              onPress={() => router.push('/(tabs)/home')}
            >
              <Text color="#FFFFFF" fontWeight="bold">
                Khám phá chuyến đi ngay ➔
              </Text>
            </Button>
          </Card>
        ) : (
          userBookings.map((b: any) => {
            const isCancelled = b.status === 'Cancelled';
            return (
              <Card
                key={b.id}
                p="$4"
                borderWidth={1}
                borderColor={isDark ? '#334155' : '#E2E8F0'}
                bg={isDark ? '#1E293B' : '#FFFFFF'}
                br="$5"
                gap="$2.5"
              >
                {/* Hàng tiêu đề & Trạng thái */}
                <XStack jc="space-between" ai="center">
                  <Text fontWeight="800" fontSize="$5" color={isDark ? '#F8FAFC' : '#0F172A'}>
                    {b.route}
                  </Text>
                  <YStack
                    px="$2.5"
                    py="$1"
                    br="$10"
                    bg={isCancelled ? (isDark ? '#450A0A' : '#FEF2F2') : (isDark ? '#052E16' : '#F0FDF4')}
                    borderWidth={1}
                    borderColor={isCancelled ? (isDark ? '#991B1B' : '#FECACA') : (isDark ? '#166534' : '#BBF7D0')}
                  >
                    <Text
                      color={isCancelled ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#4ADE80' : '#16A34A')}
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
                    <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Hành khách:</Text>
                    <Text fontWeight="600" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>{b.passengerName || 'Khách hàng'}</Text>
                  </XStack>
                  <XStack jc="space-between">
                    <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Mã chuyến & Ghế:</Text>
                    <Text fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'} fontSize="$3">
                      {b.ticketCode} (Ghế {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats})
                    </Text>
                  </XStack>
                  <XStack jc="space-between">
                    <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Giờ khởi hành:</Text>
                    <Text fontWeight="500" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>{b.departureTime}</Text>
                  </XStack>
                  <XStack jc="space-between" ai="center" mt="$1">
                    <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Tổng thanh toán:</Text>
                    <Text fontWeight="800" color={isDark ? '#F87171' : '#DC2626'} fontSize="$5">
                      {Number(b.totalPrice).toLocaleString('vi-VN')} đ
                    </Text>
                  </XStack>
                </YStack>

                <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$1" />

                {/* Nút tác vụ */}
                <XStack gap="$2" mt="$1">
                  <Button
                    size="sm"
                    bg="#0066FF"
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
                    bg={isCancelled ? (isDark ? '#334155' : '#F1F5F9') : '#DC2626'}
                    borderWidth={1}
                    borderColor={isCancelled ? (isDark ? '#475569' : '#CBD5E1') : '#DC2626'}
                    f={1}
                    br="$3"
                    disabled={isCancelled || cancelMutation.isPending}
                    opacity={isCancelled ? 0.6 : 1}
                    onPress={() => cancelMutation.mutate(b.id)}
                  >
                    <Text
                      color={isCancelled ? (isDark ? '#94A3B8' : '#64748B') : '#FFFFFF'}
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
