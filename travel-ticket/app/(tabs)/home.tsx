import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Text, Card, Button, Spinner, ScrollView } from 'tamagui';
import { api, DEFAULT_TICKETS } from '../../services/api';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
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
      {/* Banner Khuyến Mãi */}
      <Card
        p="$4"
        bg="blue10"
        br="$4"
        mb="$4"
      >
        <Text color="white" fontSize="$6" fontWeight="bold">
          🎉 Siêu Giảm Giá Mùa Du Lịch
        </Text>
        <Text color="blue2" fontSize="$3" mt="$1">
          Giảm đến 30% cho các tuyến xe khách & máy bay Đà Lạt, Nha Trang, Đà Nẵng!
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
        ].map((cat) => (
          <Button
            key={cat.key}
            size="sm"
            theme={filterType === cat.key ? 'active' : undefined}
            bg={filterType === cat.key ? 'blue10' : 'gray4'}
            color={filterType === cat.key ? 'white' : '$color'}
            onPress={() => setFilterType(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </XStack>

      {/* Tiêu đề Chuyến đi nổi bật */}
      <XStack jc="space-between" ai="center" mb="$3">
        <Text fontSize="$7" fontWeight="bold">
          Chuyến đi nổi bật
        </Text>
        <Text color="blue10" fontSize="$3" onPress={() => router.push('/(tabs)/search')}>
          Xem tất cả ➔
        </Text>
      </XStack>

      {/* Danh sách vé Responsive */}
      <XStack flexWrap="wrap" gap="$4" jc="space-between">
        {filteredTickets?.map((item: any) => (
          <Card
            key={item.id}
            width={isWide ? '48%' : '100%'}
            p="$4"
            borderWidth={1}
            borderColor="gray5"
            br="$4"
            onPress={() => handleSelectTicket(item)}
          >
            <XStack jc="space-between" ai="center">
              <YStack gap="$1" f={1}>
                <Text fontSize="$3" color="blue10" fontWeight="bold">
                  {item.brand} ({item.code})
                </Text>
                <Text fontSize="$6" fontWeight="bold">
                  {item.from} ➔ {item.to}
                </Text>
                <Text color="gray10" fontSize="$2">
                  Giờ đi: {item.departureTime} ({item.duration})
                </Text>
                <Text fontSize="$5" color="red10" fontWeight="bold" mt="$2">
                  {Number(item.price).toLocaleString('vi-VN')} đ
                </Text>
              </YStack>

              <Button
                size="sm"
                theme="active"
                onPress={() => handleSelectTicket(item)}
              >
                Chi tiết
              </Button>
            </XStack>
          </Card>
        ))}
      </XStack>
    </ScrollView>
  );
}
