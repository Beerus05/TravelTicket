import React, { useState, useMemo } from 'react';
import { useWindowDimensions, View, Text as RNText } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Text, Button, Spinner, ScrollView } from 'tamagui';
import { DEFAULT_TICKETS } from '../../services/api';
import { ticketService, getTicketWithDynamicSeats } from '../../services/ticketService';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { TicketCard } from '../../components/TicketCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';
  const [filterType, setFilterType] = useState<string>('all');

  // Responsive: Tự động chia 2 cột trên Tablet/iPad hoặc khi xoay ngang (>= 768px)
  const isWide = width >= 768;

  const { data: tickets = DEFAULT_TICKETS, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getAllTickets,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: ticketService.getAllBookings,
  });

  const liveTickets = useMemo(() => {
    return (tickets || []).map((t: any) => getTicketWithDynamicSeats(t, bookings));
  }, [tickets, bookings]);

  const filteredTickets = liveTickets.filter((t: any) =>
    filterType === 'all' ? true : t.type === filterType
  );

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="#0066FF" />
        <Text mt="$2" color="#64748B">Đang tải danh sách vé...</Text>
      </YStack>
    );
  }

  const handleSelectTicket = (item: Ticket) => {
    dispatch(setSelectedTicket(item));
    router.push(`/ticket/${item.id}`);
  };

  return (
    <ScrollView
      f={1}
      bg="$background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: Math.max(insets.top + 8, 16),
        paddingBottom: 28,
      }}
    >
      {/* Tiêu đề Travel Ticket & Lời chào */}
      <YStack mb="$3">
        <XStack ai="center" gap="$2" mb="$1">
          <YStack w={36} h={36} br="$3" bg="#0066FF" jc="center" ai="center">
            <Text fontSize="$4">✈️</Text>
          </YStack>
          <Text fontSize="$8" fontWeight="900" color="#0066FF" letterSpacing={0.5}>
            TRAVEL TICKET
          </Text>
        </XStack>
        <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'}>
          Xin chào, <Text fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>{user?.name || 'Nguyễn Đình Phi'}</Text> 👋
        </Text>
        <Text fontSize="$6" fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'} mt="$1">
          Khám phá chuyến đi hôm nay
        </Text>
      </YStack>

      {/* Banner Khuyến Mãi (Khóa chặt chiều cao 118px, chống giãn dọc) */}
      <View
        style={{
          backgroundColor: '#0066FF',
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 16,
          height: 118,
          maxHeight: 125,
          overflow: 'hidden',
          justifyContent: 'space-between',
          shadowColor: '#0066FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <RNText style={{ color: '#0066FF', fontSize: 11, fontWeight: '800' }}>ƯU ĐÃI ĐỘC QUYỀN</RNText>
          </View>
          <RNText style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Mã: IUH (-100K)</RNText>
        </View>

        <RNText style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
          🎉 Mùa Du Lịch & Nghỉ Lễ 2026
        </RNText>

        <RNText
          style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: 11.5, lineHeight: 16 }}
          numberOfLines={2}
        >
          Giảm đến 30% cho các tuyến Đà Lạt, Nha Trang, Đà Nẵng, Sapa. Đặt sớm giữ chỗ ngay!
        </RNText>
      </View>

      {/* Danh mục phương tiện */}
      <Text fontSize="$4" fontWeight="bold" mb="$2" color={isDark ? '#F8FAFC' : '#0F172A'}>
        Danh mục phương tiện
      </Text>
      <XStack gap="$2" mb="$4" flexWrap="wrap">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'flight', label: '✈️ Máy bay' },
          { key: 'bus', label: '🚌 Xe khách' },
          { key: 'train', label: '🚆 Tàu hỏa' },
        ].map((cat) => {
          const isActive = filterType === cat.key;
          return (
            <Button
              key={cat.key}
              size="sm"
              br="$10"
              px="$3.5"
              bg={isActive ? '#0066FF' : (isDark ? '#1E293B' : '#F1F5F9')}
              borderWidth={1.5}
              borderColor={isActive ? '#0066FF' : (isDark ? '#334155' : '#CBD5E1')}
              onPress={() => setFilterType(cat.key)}
            >
              <Text
                color={isActive ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')}
                fontWeight={isActive ? 'bold' : '600'}
                fontSize="$3"
              >
                {cat.label}
              </Text>
            </Button>
          );
        })}
      </XStack>

      {/* Tiêu đề Chuyến đi nổi bật */}
      <XStack jc="space-between" ai="center" mb="$3">
        <Text fontSize="$6" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
          Chuyến đi nổi bật ({filteredTickets?.length || 0})
        </Text>
        <Text
          color={isDark ? '#38BDF8' : '#0066FF'}
          fontSize="$3"
          fontWeight="bold"
          onPress={() => router.push('/(tabs)/search')}
        >
          Xem tất cả ➔
        </Text>
      </XStack>

      {/* Danh sách vé Responsive bằng TicketCard */}
      <XStack flexWrap="wrap" gap="$3" jc="space-between">
        {filteredTickets?.map((item: any) => (
          <TicketCard
            key={item.id}
            ticket={item}
            width={isWide ? '48.5%' : '100%'}
            onSelect={handleSelectTicket}
          />
        ))}
      </XStack>
    </ScrollView>
  );
}
