import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, XStack, Input, Button, Text, Card, ScrollView, Spinner } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { api, DEFAULT_TICKETS } from '../../services/api';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { RootState } from '../../store/store';
import { TicketCard } from '../../components/TicketCard';

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

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

  const handleSelectTicket = (item: Ticket) => {
    dispatch(setSelectedTicket(item));
    router.push(`/ticket/${item.id}`);
  };

  return (
    <YStack f={1} p="$4" bg="$background" gap="$3.5">
      {/* Ô tìm kiếm to gấp đôi */}
      <Input
        height={60}
        fontSize="$5"
        px="$4"
        br="$4"
        borderWidth={2}
        borderColor={isDark ? '#38BDF8' : '#0066FF'}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
        color={isDark ? '#F8FAFC' : '#0F172A'}
        placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
        placeholder="🔍 Nhập điểm đi, điểm đến, hãng xe, máy bay..."
        value={keyword}
        onChangeText={setKeyword}
      />

      {/* Bộ lọc mức giá */}
      <XStack gap="$2" flexWrap="wrap">
        {[
          { label: 'Tất cả giá', val: null },
          { label: 'Dưới 500k', val: 500000 },
          { label: 'Dưới 1 triệu', val: 1000000 },
          { label: 'Dưới 1.5 triệu', val: 1500000 },
        ].map((p, idx) => {
          const isActive = maxPrice === p.val;
          return (
            <Button
              key={idx}
              size="sm"
              br="$10"
              px="$3.5"
              bg={isActive ? '#0066FF' : (isDark ? '#1E293B' : '#F1F5F9')}
              borderWidth={1.5}
              borderColor={isActive ? '#0066FF' : (isDark ? '#334155' : '#CBD5E1')}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setMaxPrice(p.val)}
            >
              <Text
                color={isActive ? '#FFFFFF' : (isDark ? '#E2E8F0' : '#1E293B')}
                fontWeight={isActive ? 'bold' : '600'}
                fontSize="$3"
              >
                {p.label}
              </Text>
            </Button>
          );
        })}
      </XStack>

      <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'}>
        Tìm thấy <Text fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'}>{filtered.length}</Text> chuyến đi phù hợp
      </Text>

      <ScrollView f={1}>
        <XStack flexWrap="wrap" gap="$3" jc="space-between">
          {filtered.map((item: any) => (
            <TicketCard
              key={item.id}
              ticket={item}
              width={isWide ? '48.5%' : '100%'}
              onSelect={handleSelectTicket}
            />
          ))}
          {filtered.length === 0 && (
            <Card
              p="$6"
              w="100%"
              ai="center"
              gap="$2"
              borderWidth={1}
              borderColor={isDark ? '#334155' : '#E2E8F0'}
              bg={isDark ? '#1E293B' : '#FFFFFF'}
              br="$5"
              mt="$4"
            >
              <Text fontSize="$8">🔎</Text>
              <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
                Không tìm thấy chuyến đi
              </Text>
              <Text color={isDark ? '#94A3B8' : '#64748B'} ta="center">
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn mức giá khác xem sao nhé!
              </Text>
            </Card>
          )}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
