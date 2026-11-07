import React from 'react';
import { YStack, XStack, Text, Card, Button, Separator, ScrollView } from 'tamagui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ticketService } from '../../services/ticketService';
import { CheckCircle, QrCode } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ETicketScreen() {
  const { bookingId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      return await ticketService.getBookingById(String(bookingId));
    },
    enabled: !!bookingId,
  });

  return (
    <ScrollView
      f={1}
      bg="$background"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Math.max(insets.top + 16, 32),
        paddingBottom: Math.max(insets.bottom + 16, 32),
      }}
    >
      <Card
        w="100%"
        maxWidth={440}
        p="$5"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
        br="$5"
        gap="$3"
        ai="center"
      >
        <CheckCircle size={56} color="#10B981" />
        <Text fontSize="$7" fontWeight="900" color={isDark ? '#4ADE80' : '#16A34A'}>
          Đặt vé thành công!
        </Text>
        <Text color={isDark ? '#94A3B8' : '#64748B'} ta="center" fontSize="$3">
          Vui lòng xuất trình vé điện tử hoặc mã QR dưới đây khi lên phương tiện
        </Text>

        <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$1" w="100%" />

        <YStack w="100%" gap="$2.5">
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Mã đặt chỗ:</Text>
            <Text fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>#{booking?.id || bookingId || '8899'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Hành trình:</Text>
            <Text fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>{booking?.route || 'TP.HCM ➔ Đà Lạt'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Mã chuyến:</Text>
            <Text fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'}>{booking?.ticketCode || 'FUTA-DL01'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Giờ khởi hành:</Text>
            <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{booking?.departureTime || '08:00 - 15/11/2026'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Hành khách:</Text>
            <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{booking?.passengerName || 'Nguyễn Đình Phi'}</Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Số ghế ngồi:</Text>
            <Text fontWeight="900" color={isDark ? '#38BDF8' : '#0066FF'}>
              {Array.isArray(booking?.seats) ? booking.seats.join(', ') : (booking?.seats || 'A1')}
            </Text>
          </XStack>
          <XStack jc="space-between">
            <Text color={isDark ? '#94A3B8' : '#64748B'}>Tổng tiền đã trả:</Text>
            <Text fontWeight="900" color={isDark ? '#F87171' : '#DC2626'} fontSize="$5">
              {Number(booking?.totalPrice || 320000).toLocaleString('vi-VN')} đ
            </Text>
          </XStack>
        </YStack>

        {/* Khung giả lập QR Code */}
        <YStack p="$4" bg="white" br="$4" mt="$2" ai="center" gap="$2" w="100%" borderWidth={1} borderColor="#E2E8F0">
          <QrCode size={110} color="#000" />
          <Text fontSize="$2" color="#475569" fontWeight="600">
            MÃ VÉ: TRAVEL-TICKET-{bookingId || 'VERIFIED'}
          </Text>
        </YStack>

        <Button
          w="100%"
          mt="$3"
          size="lg"
          bg="#0066FF"
          br="$4"
          onPress={() => router.replace('/(tabs)/my-tickets')}
        >
          <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
            Xem danh sách Vé của tôi ➔
          </Text>
        </Button>

        <Button
          w="100%"
          bg="transparent"
          borderWidth={0}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold">Về trang chủ</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
