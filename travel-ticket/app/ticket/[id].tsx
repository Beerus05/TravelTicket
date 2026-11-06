import React from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView, Separator } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedTicket } from '../../store/bookingSlice';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TicketDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { selectedTicket: reduxTicket, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

  const { data: fetchedTicket } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      return await ticketService.getTicketById(String(id));
    },
  });

  const ticket = fetchedTicket || reduxTicket;

  if (!ticket) {
    return (
      <YStack f={1} p="$4" jc="center" ai="center" bg="$background">
        <Text fontSize="$6">Không tìm thấy thông tin vé chuyến đi.</Text>
        <Button mt="$3" theme="active" onPress={() => router.back()}>
          Quay lại
        </Button>
      </YStack>
    );
  }

  const handleContinue = () => {
    dispatch(setSelectedTicket(ticket));
    router.push('/booking/seat-selection');
  };

  const getAmenityTags = (type?: string) => {
    switch (type) {
      case 'flight':
        return ['✈️ Bay thẳng', '🧳 23kg hành lý', '🥪 Suất ăn nhẹ', '⚡ Check-in nhanh'];
      case 'train':
        return ['🚆 Giường nằm mềm', '❄️ Điều hòa 24/7', '🌅 Ngắm cảnh biển', '🍽️ Phục vụ ăn nhẹ'];
      case 'bus':
      default:
        return ['🚌 Limousine', '🛜 Wifi miễn phí', '💧 Nước & khăn lạnh', '⚡ Sạc Type-C'];
    }
  };

  const amenities = getAmenityTags(ticket.type);

  return (
    <YStack f={1} bg="$background" jc="space-between" pt={insets.top > 0 ? insets.top : 12}>
      {/* Header điều hướng trên cùng chuẩn iOS */}
      <XStack
        ai="center"
        jc="space-between"
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor={isDark ? '#334155' : '#E2E8F0'}
        bg="$background"
      >
        <Button
          size="sm"
          bg={isDark ? '#1E293B' : '#F1F5F9'}
          pressStyle={{ bg: isDark ? '#334155' : '#E2E8F0' }}
          br="$10"
          px="$3"
          onPress={() => router.back()}
        >
          <Text color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold" fontSize="$3">
            ❮ Quay lại
          </Text>
        </Button>

        <Text fontSize="$5" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
          Chi tiết chuyến đi
        </Text>

        <YStack w={75} />
      </XStack>

      <ScrollView f={1} px="$4" pt="$3" showsVerticalScrollIndicator={false}>
        <YStack gap="$3" pb="$3">
          {/* Thẻ hành trình chính */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$2.5"
          >
            <XStack jc="space-between" ai="center">
              <YStack
                px="$2.5"
                py="$1"
                br="$10"
                bg={isDark ? '#1E3A8A' : '#EFF6FF'}
                borderWidth={1}
                borderColor={isDark ? '#1D4ED8' : '#BFDBFE'}
              >
                <Text fontSize="$2" fontWeight="bold" color={isDark ? '#93C5FD' : '#1D4ED8'}>
                  {ticket.brand}
                </Text>
              </YStack>
              <Text fontSize="$3" color={isDark ? '#CBD5E1' : '#64748B'} fontWeight="600">
                Mã: {ticket.code}
              </Text>
            </XStack>

            <Text fontSize="$7" fontWeight="900" color={isDark ? '#F8FAFC' : '#0F172A'}>
              {ticket.from} ➔ {ticket.to}
            </Text>

            <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} my="$1" />

            <YStack gap="$2">
              <XStack jc="space-between">
                <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Giờ khởi hành:</Text>
                <Text fontWeight="600" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>{ticket.departureTime}</Text>
              </XStack>
              <XStack jc="space-between">
                <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Thời gian di chuyển:</Text>
                <Text fontWeight="600" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>{ticket.duration}</Text>
              </XStack>
              <XStack jc="space-between">
                <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$3">Số ghế còn trống:</Text>
                <Text fontWeight="bold" color={isDark ? '#4ADE80' : '#16A34A'} fontSize="$3">
                  {ticket.availableSeats || 12} ghế
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* Lịch trình đón trả trực quan */}
          <Card
            p="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            bg={isDark ? '#1E293B' : '#FFFFFF'}
            br="$5"
            gap="$2.5"
          >
            <Text fontSize="$4" fontWeight="bold" color={isDark ? '#F8FAFC' : '#0F172A'}>
              📍 Lộ trình chuyến đi
            </Text>

            <YStack gap="$2">
              <XStack ai="flex-start" gap="$2.5">
                <Text fontSize="$4">🟢</Text>
                <YStack f={1}>
                  <Text fontWeight="bold" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>Điểm xuất phát: {ticket.from}</Text>
                  <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">Bến xe / Sân bay trung tâm • Khởi hành {ticket.departureTime.split(' - ')[0] || 'đúng giờ'}</Text>
                </YStack>
              </XStack>

              <YStack ml="$2" pl="$2" borderLeftWidth={1.5} borderLeftColor={isDark ? '#334155' : '#E2E8F0'} py="$1">
                <Text color={isDark ? '#38BDF8' : '#0066FF'} fontSize="$2" fontWeight="600">
                  ⏱️ {ticket.duration} di chuyển êm ái, an toàn
                </Text>
              </YStack>

              <XStack ai="flex-start" gap="$2.5">
                <Text fontSize="$4">🔴</Text>
                <YStack f={1}>
                  <Text fontWeight="bold" fontSize="$3" color={isDark ? '#F8FAFC' : '#0F172A'}>Điểm đến: {ticket.to}</Text>
                  <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2.5">Trả khách tại trung tâm thị xã / thành phố</Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* Tiện ích đi kèm */}
          <XStack
            px="$3.5"
            py="$2.5"
            bg={isDark ? '#1E293B' : '#F1F5F9'}
            br="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            ai="center"
            gap="$2"
          >
            <Text fontSize="$3.5">✨</Text>
            <Text fontSize="$3" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Tiện ích:
            </Text>
            <Text fontSize="$2.5" color={isDark ? '#94A3B8' : '#64748B'} f={1}>
              {amenities.join(' • ')}
            </Text>
          </XStack>

          {/* Chính sách hoàn hủy */}
          <XStack
            px="$3.5"
            py="$2.5"
            bg={isDark ? '#1E293B' : '#F1F5F9'}
            br="$4"
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#E2E8F0'}
            ai="center"
            gap="$2"
          >
            <Text fontSize="$3.5">🛡️</Text>
            <Text fontSize="$3" fontWeight="700" color={isDark ? '#F8FAFC' : '#0F172A'}>
              Bảo đảm:
            </Text>
            <Text fontSize="$2.5" color={isDark ? '#94A3B8' : '#64748B'} f={1}>
              Bảo hiểm hành khách • Hoàn 100% trước 24h
            </Text>
          </XStack>
        </YStack>
      </ScrollView>

      {/* Thanh cố định dưới đáy màn hình iPhone */}
      <Card
        p="$4"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
        br="$5"
        gap="$2"
        mx="$4"
        mt="$1"
        mb={Math.max(insets.bottom, 12)}
        bg={isDark ? '#1E293B' : '#FFFFFF'}
      >
        <XStack jc="space-between" ai="center">
          <YStack>
            <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2">Giá vé trọn gói:</Text>
            <Text fontSize="$8" color={isDark ? '#F87171' : '#DC2626'} fontWeight="900">
              {Number(ticket.price).toLocaleString('vi-VN')} đ
            </Text>
          </YStack>

          <Button
            size="lg"
            bg="#0066FF"
            pressStyle={{ bg: '#0052CC' }}
            br="$4"
            px="$4"
            onPress={handleContinue}
          >
            <Text color="#FFFFFF" fontWeight="900" fontSize="$4">
              Chọn chỗ ngồi ➔
            </Text>
          </Button>
        </XStack>
      </Card>
    </YStack>
  );
}
