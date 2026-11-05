import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Text, Card, Button, Spinner, ScrollView } from 'tamagui';
import { api, DEFAULT_TICKETS } from '../../services/api';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { TicketCard } from '../../components/TicketCard';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const user = useSelector((state: RootState) => state.booking.user);
  const [filterType, setFilterType] = useState<string>('all');

  // Responsive: Tự động chia 2 cột trên Tablet/iPad hoặc khi xoay ngang (>= 768px)
  const isWide = width >= 768;

  const { data: tickets = DEFAULT_TICKETS, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        const res = await api.get('/tickets');
        return res.data && res.data.length > 0 ? res.data : DEFAULT_TICKETS;
      } catch {
        return DEFAULT_TICKETS;
      }
    },
  });

  const filteredTickets = tickets?.filter((t: any) =>
    filterType === 'all' ? true : t.type === filterType
  );

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="blue10" />
        <Text mt="$2" color="gray10">Đang tải danh sách vé...</Text>
      </YStack>
    );
  }

  const handleSelectTicket = (item: Ticket) => {
    dispatch(setSelectedTicket(item));
    router.push(`/ticket/${item.id}`);
  };

  return (
    <ScrollView bg="$background" p="$4">
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
        <Text fontSize="$3" color="gray11">
          Xin chào, <Text fontWeight="bold" color="$color">{user?.name || 'Nguyễn Đình Phi'}</Text> 👋
        </Text>
        <Text fontSize="$6" fontWeight="800" color="$color" mt="$1">
          Khám phá chuyến đi hôm nay
        </Text>
      </YStack>

      {/* Banner Khuyến Mãi */}
      <Card
        p="$4"
        bg="#0066FF"
        br="$5"
        mb="$4"
        gap="$2"
      >
        <XStack ai="center" jc="space-between">
          <YStack px="$2.5" py="$1" br="$10" bg="white">
            <Text color="#0066FF" fontSize="$2" fontWeight="800">
              ƯU ĐÃI ĐỘC QUYỀN
            </Text>
          </YStack>
          <Text color="white" fontSize="$2" fontWeight="bold">
            Mã: IUH (-100K)
          </Text>
        </XStack>

        <Text color="white" fontSize="$6" fontWeight="bold">
          🎉 Mùa Du Lịch & Nghỉ Lễ 2026
        </Text>
        <Text color="white" opacity={0.9} fontSize="$3">
          Giảm đến 30% cho các tuyến Đà Lạt, Nha Trang, Đà Nẵng, Sapa. Đặt sớm giữ chỗ ngay!
        </Text>
      </Card>

      {/* Danh mục phương tiện */}
      <Text fontSize="$4" fontWeight="bold" mb="$2">
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
              bg={isActive ? '#0066FF' : '#F1F5F9'}
              borderWidth={1.5}
              borderColor={isActive ? '#0066FF' : '#CBD5E1'}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setFilterType(cat.key)}
            >
              <Text
                color={isActive ? '#FFFFFF' : '#1E293B'}
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
        <Text fontSize="$6" fontWeight="bold">
          Chuyến đi nổi bật ({filteredTickets?.length || 0})
        </Text>
        <Text
          color="#0066FF"
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
