import React, { useState, useMemo } from 'react';
import {
  useWindowDimensions,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView as RNScrollView,
} from 'react-native';
import { YStack, XStack, Button, Text, Card, Spinner } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { DEFAULT_TICKETS } from '../../services/api';
import { ticketService, getTicketWithDynamicSeats } from '../../services/ticketService';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { RootState } from '../../store/store';
import { TicketCard } from '../../components/TicketCard';

// Hàm chuẩn hóa tiếng Việt không dấu để so sánh tìm kiếm
function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Bảng ánh xạ từ khóa viết tắt / tên thông dụng sang địa danh chuẩn
const LOCATION_ALIASES: Record<string, string[]> = {
  'TP.HCM': ['tphcm', 'hcm', 'sg', 'sai gon', 'sai gòn', 'ho chi minh', 'hồ chí minh', 'thanh pho ho chi minh'],
  'Hà Nội': ['hn', 'ha noi', 'hà nội', 'thu do', 'thủ đô'],
  'Đà Lạt': ['dl', 'da lat', 'đà lạt', 'dalat', 'lam dong', 'lâm đồng'],
  'Nha Trang': ['nt', 'nha trang', 'khanh hoa', 'khánh hòa'],
  'Đà Nẵng': ['dn', 'da nang', 'đà nẵng', 'danang'],
  'Sapa': ['sp', 'sapa', 'sa pa', 'lao cai', 'lào cai'],
  'Phan Thiết': ['pt', 'phan thiet', 'phan thiết', 'binh thuan', 'bình thuận', 'mui ne', 'mũi né'],
  'Sóc Trăng': ['st', 'soc trang', 'sóc trăng'],
  'Cần Thơ': ['ct', 'can tho', 'cần thơ', 'tay do', 'tây đô'],
};

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all'); // 'all' | 'flight' | 'bus' | 'train'
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'seats'>('default');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

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

  // Bộ lọc thông minh phân tích cú pháp tìm kiếm đa chiều
  const filteredAndSortedTickets = useMemo(() => {
    const rawInput = keyword.trim();
    const normalizedInput = removeVietnameseTones(rawInput);

    // Xác định xem người dùng có gõ alias địa danh nào không
    const detectedLocations: string[] = [];
    Object.entries(LOCATION_ALIASES).forEach(([stdName, aliases]) => {
      for (const a of aliases) {
        const normA = removeVietnameseTones(a);
        if (
          normalizedInput === normA ||
          normalizedInput.includes(` ${normA} `) ||
          normalizedInput.startsWith(`${normA} `) ||
          normalizedInput.endsWith(` ${normA}`) ||
          normalizedInput.includes(`-${normA}`) ||
          normalizedInput.includes(`>${normA}`)
        ) {
          detectedLocations.push(stdName);
          break;
        }
      }
    });

    let result = liveTickets.filter((t: any) => {
      // 1. Lọc theo phương tiện
      if (selectedType !== 'all' && t.type !== selectedType) {
        return false;
      }

      // 2. Lọc theo mức giá tối đa
      if (maxPrice !== null && Number(t.price) > maxPrice) {
        return false;
      }

      // 3. Lọc chỉ hiện chuyến còn chỗ
      if (onlyAvailable && Number(t.availableSeats || 0) <= 0) {
        return false;
      }

      // 4. Nếu không gõ từ khóa -> thỏa mãn tất cả
      if (!rawInput) return true;

      // 5. Kiểm tra khớp Alias địa danh
      if (detectedLocations.length > 0) {
        const matchesAnyLocation = detectedLocations.some(
          (loc) => t.from === loc || t.to === loc
        );
        if (matchesAnyLocation) return true;
      }

      // 6. Kiểm tra khớp từ khóa thông minh (không dấu & có dấu)
      const normFrom = removeVietnameseTones(t.from);
      const normTo = removeVietnameseTones(t.to);
      const normBrand = removeVietnameseTones(t.brand);
      const normCode = removeVietnameseTones(t.code);
      const normDesc = removeVietnameseTones(t.description || '');

      // Nhận diện kiểu "Sài Gòn đi Đà Lạt" hoặc "TP.HCM - Nha Trang"
      const isRouteMatch =
        (normFrom.includes(normalizedInput) || normTo.includes(normalizedInput)) ||
        normalizedInput.includes(normFrom) ||
        normalizedInput.includes(normTo);

      return (
        normFrom.includes(normalizedInput) ||
        normTo.includes(normalizedInput) ||
        normBrand.includes(normalizedInput) ||
        normCode.includes(normalizedInput) ||
        normDesc.includes(normalizedInput) ||
        isRouteMatch
      );
    });

    // Sắp xếp thông minh
    if (sortBy === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'seats') {
      result.sort((a, b) => Number(b.availableSeats || 0) - Number(a.availableSeats || 0));
    }

    return result;
  }, [liveTickets, keyword, selectedType, maxPrice, sortBy, onlyAvailable]);

  const handleSelectTicket = (item: Ticket) => {
    dispatch(setSelectedTicket(item));
    router.push(`/ticket/${item.id}`);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedType('all');
    setMaxPrice(null);
    setSortBy('default');
    setOnlyAvailable(false);
  };

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Spinner size="large" color="#0066FF" />
        <Text mt="$2" color="#64748B">Đang tìm kiếm chuyến đi...</Text>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background" p="$3" gap="$2.5">
      {/* 1. Ô tìm kiếm thông minh có nút xóa (Clear) */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: isDark ? '#38BDF8' : '#0066FF',
          paddingHorizontal: 12,
          height: 46,
          shadowColor: '#0066FF',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text fontSize={16} mr="$2">🔍</Text>
        <TextInput
          style={{
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#F8FAFC' : '#0F172A',
          }}
          placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          placeholder="Gõ 'SG DL', 'Hà Nội', 'FUTA', 'Tàu SE4'..."
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
        />

        {keyword.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setKeyword('')}
            style={{
              padding: 4,
              borderRadius: 12,
              backgroundColor: isDark ? '#334155' : '#E2E8F0',
            }}
          >
            <Text fontSize={12} color={isDark ? '#CBD5E1' : '#64748B'} fontWeight="bold">
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Gợi ý tìm kiếm thịnh hành (Trending chips - Chiều cao cố định chuẩn mobile 30px, chống giãn dọc) */}
      <View style={{ height: 32 }}>
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', gap: 6 }}
        >
          {[
            { label: '🔥 Sài Gòn ➔ Đà Lạt', q: 'Đà Lạt' },
            { label: '🏖️ TP.HCM ➔ Nha Trang', q: 'Nha Trang' },
            { label: '🌉 Hà Nội ➔ Đà Nẵng', q: 'Đà Nẵng' },
            { label: '🚌 Phương Trang', q: 'Phương Trang' },
            { label: '✈️ Vietnam Airlines', q: 'Vietnam Airlines' },
            { label: '🚆 Tàu SE4', q: 'SE4' },
            { label: '🏔️ Sapa Limousine', q: 'Sapa' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => setKeyword(item.q)}
              style={{
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                borderRadius: 16,
                paddingHorizontal: 10,
                height: 28,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#CBD5E1',
              }}
            >
              <Text fontSize={11.5} color={isDark ? '#93C5FD' : '#0066FF'} fontWeight="600">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </RNScrollView>
      </View>

      {/* 3. Phân loại Phương tiện (Transport Tabs) */}
      <XStack gap="$1.5">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'flight', label: '✈️ Máy bay' },
          { key: 'bus', label: '🚌 Xe khách' },
          { key: 'train', label: '🚆 Tàu hỏa' },
        ].map((tab) => {
          const isActive = selectedType === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.75}
              onPress={() => setSelectedType(tab.key)}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isActive ? '#0066FF' : isDark ? '#1E293B' : '#F8FAFC',
                borderWidth: 1.5,
                borderColor: isActive ? '#0066FF' : isDark ? '#334155' : '#CBD5E1',
              }}
            >
              <Text
                fontSize={12}
                fontWeight={isActive ? '800' : '600'}
                color={isActive ? '#FFFFFF' : isDark ? '#E2E8F0' : '#475569'}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </XStack>

      {/* 4. Bộ lọc mức giá & Sắp xếp thông minh (Chiều cao cố định 28px) */}
      <View style={{ height: 28 }}>
        <RNScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', gap: 6 }}
        >
          {[
            { label: 'Tất cả giá', val: null },
            { label: '< 300k', val: 300000 },
            { label: '< 500k', val: 500000 },
            { label: '< 1 triệu', val: 1000000 },
          ].map((p, idx) => {
            const isActive = maxPrice === p.val;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setMaxPrice(p.val)}
                style={{
                  paddingHorizontal: 10,
                  height: 26,
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: isActive ? (isDark ? '#0284C7' : '#0066FF') : isDark ? '#1E293B' : '#F1F5F9',
                  borderWidth: 1,
                  borderColor: isActive ? '#0066FF' : isDark ? '#334155' : '#CBD5E1',
                }}
              >
                <Text
                  fontSize={11}
                  fontWeight={isActive ? 'bold' : '600'}
                  color={isActive ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Toggle chỉ hiện chuyến còn chỗ */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setOnlyAvailable(!onlyAvailable)}
            style={{
              paddingHorizontal: 10,
              height: 26,
              borderRadius: 13,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: onlyAvailable ? '#16A34A' : isDark ? '#1E293B' : '#F1F5F9',
              borderWidth: 1,
              borderColor: onlyAvailable ? '#16A34A' : isDark ? '#334155' : '#CBD5E1',
            }}
          >
            <Text
              fontSize={11}
              fontWeight={onlyAvailable ? 'bold' : '600'}
              color={onlyAvailable ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            >
              {onlyAvailable ? '✓ Còn chỗ' : 'Ghế trống'}
            </Text>
          </TouchableOpacity>
        </RNScrollView>
      </View>

      {/* 5. Dòng thống kê kết quả & Nút chọn sắp xếp */}
      <XStack jc="space-between" ai="center">
        <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
          Tìm thấy{' '}
          <Text fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'}>
            {filteredAndSortedTickets.length}
          </Text>{' '}
          chuyến đi phù hợp
        </Text>

        {/* Nút đổi kiểu sắp xếp */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (sortBy === 'default') setSortBy('price_asc');
            else if (sortBy === 'price_asc') setSortBy('price_desc');
            else if (sortBy === 'price_desc') setSortBy('seats');
            else setSortBy('default');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: isDark ? '#334155' : '#EFF6FF',
          }}
        >
          <Text fontSize={11} fontWeight="700" color={isDark ? '#38BDF8' : '#0066FF'}>
            {sortBy === 'default' && '⚡ Mặc định'}
            {sortBy === 'price_asc' && '💵 Giá tăng dần'}
            {sortBy === 'price_desc' && '💎 Giá giảm dần'}
            {sortBy === 'seats' && '💺 Nhiều ghế nhất'}
          </Text>
        </TouchableOpacity>
      </XStack>

      {/* 6. Danh sách kết quả vé Responsive */}
      <RNScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <XStack flexWrap="wrap" gap="$3" jc="space-between">
          {filteredAndSortedTickets.map((item: any) => (
            <TicketCard
              key={item.id}
              ticket={item}
              width={isWide ? '48.5%' : '100%'}
              onSelect={handleSelectTicket}
            />
          ))}

          {filteredAndSortedTickets.length === 0 && (
            <Card
              p="$5"
              w="100%"
              ai="center"
              gap="$2"
              borderWidth={1}
              borderColor={isDark ? '#334155' : '#E2E8F0'}
              bg={isDark ? '#1E293B' : '#FFFFFF'}
              br="$5"
              mt="$2"
            >
              <Text fontSize={36}>🔎</Text>
              <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
                Không tìm thấy chuyến đi phù hợp
              </Text>
              <Text color={isDark ? '#94A3B8' : '#64748B'} ta="center" fontSize={13}>
                Hãy thử tìm kiếm với các từ khóa ngắn như &quot;Đà Lạt&quot;, &quot;Nha Trang&quot;, hoặc chọn phương tiện khác.
              </Text>

              <Button
                mt="$2"
                size="sm"
                bg="#0066FF"
                br="$4"
                onPress={handleResetFilters}
              >
                <Text color="#FFFFFF" fontWeight="bold" fontSize={13}>
                  🔄 Đặt lại toàn bộ bộ lọc
                </Text>
              </Button>
            </Card>
          )}
        </XStack>
      </RNScrollView>
    </YStack>
  );
}
