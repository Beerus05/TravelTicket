import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, XStack, Input, Button, Text, Card, ScrollView, Spinner } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { api, DEFAULT_TICKETS } from '../../services/api';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setSelectedTicket } from '../../store/bookingSlice';

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [keyword, setKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

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

  const filtered = tickets.filter((t: any) => {
    const matchKey =
      t.from.toLowerCase().includes(keyword.toLowerCase()) ||
      t.to.toLowerCase().includes(keyword.toLowerCase()) ||
      t.brand.toLowerCase().includes(keyword.toLowerCase()) ||
      t.code.toLowerCase().includes(keyword.toLowerCase());
    const matchPrice = maxPrice ? Number(t.price) <= maxPrice : true;
    return matchKey && matchPrice;
  });

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="blue10" />
      </YStack>
    );
  }

  return (
    <YStack f={1} p="$4" bg="$background" gap="$3">
      <Input
        size="$4"
        placeholder="Nhập điểm đi, điểm đến hoặc hãng xe/máy bay..."
        value={keyword}
        onChangeText={setKeyword}
      />

      {/* Bộ lọc mức giá */}
      <XStack gap="$2" flexWrap="wrap">
        {[
          { label: 'Tất cả giá', val: null },
          { label: 'Dưới 500k', val: 500000 },
          { label: 'Dưới 1 triệu', val: 1000000 },
        ].map((p, idx) => (
          <Button
            key={idx}
            size="sm"
            theme={maxPrice === p.val ? 'active' : undefined}
            bg={maxPrice === p.val ? 'blue10' : 'gray4'}
            color={maxPrice === p.val ? 'white' : '$color'}
            onPress={() => setMaxPrice(p.val)}
          >
            {p.label}
          </Button>
        ))}
      </XStack>

      <ScrollView f={1}>
        <XStack flexWrap="wrap" gap="$3" jc="space-between">
          {filtered.map((item: any) => (
            <Card
              key={item.id}
              width={isWide ? '48%' : '100%'}
              p="$4"
              borderWidth={1}
              borderColor="gray5"
              br="$4"
              onPress={() => {
                dispatch(setSelectedTicket(item));
                router.push(`/ticket/${item.id}`);
              }}
            >
              <Text fontWeight="bold" fontSize="$5">
                {item.from} ➔ {item.to}
              </Text>
              <Text color="gray10">
                {item.brand} ({item.code}) • {item.departureTime}
              </Text>
              <Text color="red10" fontWeight="bold" mt="$2">
                {Number(item.price).toLocaleString('vi-VN')} đ
              </Text>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Text color="gray10" ta="center" w="100%" mt="$4">
              Không tìm thấy chuyến đi phù hợp.
            </Text>
          )}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
