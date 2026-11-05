import React from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView, Separator } from 'tamagui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setSelectedTicket } from '../../store/bookingSlice';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';

export default function TicketDetailScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const reduxTicket = useSelector((state: RootState) => state.booking.selectedTicket);

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
    <ScrollView f={1} bg="$background" p="$3.5">
      <YStack gap="$3">
        {/* Thẻ hành trình chính */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="gray5"
          br="$4"
          gap="$2.5"
        >
          <XStack jc="space-between" ai="center">
            <YStack px="$2.5" py="$0.5" br="$10" bg="blue3">
              <Text fontSize="$2" fontWeight="bold" color="blue10">
                {ticket.brand}
              </Text>
            </YStack>
            <Text fontSize="$2" color="gray10" fontWeight="600">
              Mã: {ticket.code}
            </Text>
          </XStack>

          <Text fontSize="$7" fontWeight="900" color="$color">
            {ticket.from} ➔ {ticket.to}
          </Text>

          <Separator borderColor="gray4" my="$0.5" />

          <YStack gap="$1.5">
            <XStack jc="space-between">
              <Text color="gray10" fontSize="$3">Giờ khởi hành:</Text>
              <Text fontWeight="600" fontSize="$3">{ticket.departureTime}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="gray10" fontSize="$3">Thời gian di chuyển:</Text>
              <Text fontWeight="600" fontSize="$3">{ticket.duration}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="gray10" fontSize="$3">Số ghế còn trống:</Text>
              <Text fontWeight="bold" color="green10" fontSize="$3">
                {ticket.availableSeats || 12} ghế
              </Text>
            </XStack>
          </YStack>
        </Card>

        {/* Tiện ích & Dịch vụ đi kèm (Đã thu gọn nhỏ gọn, tinh tế) */}
        <Card
          p="$3.5"
          borderWidth={1}
          borderColor="gray5"
          br="$4"
          gap="$2"
        >
          <XStack ai="center" gap="$1.5">
            <Text fontSize="$3.5" fontWeight="bold" color="$color">
              ✨ Tiện ích đi kèm
            </Text>
          </XStack>

          {/* Các chip tiện ích gọn gàng */}
          <XStack gap="$1.5" flexWrap="wrap">
            {amenities.map((item, idx) => (
              <YStack key={idx} px="$2" py="$0.5" bg="gray3" br="$3" borderWidth={1} borderColor="gray5">
                <Text fontSize="$2" color="gray11" fontWeight="600">
                  {item}
                </Text>
              </YStack>
            ))}
          </XStack>

          <Text color="gray10" fontSize="$2.5" lineHeight={18} mt="$0.5">
            {ticket.description || 'Chuyến đi tiện nghi, phục vụ nước uống và khăn lạnh miễn phí. Đón trả đúng giờ.'}
          </Text>
        </Card>

        {/* Chính sách hoàn hủy */}
        <Card
          p="$3.5"
          borderWidth={1}
          borderColor="gray5"
          br="$4"
          gap="$1.5"
        >
          <Text fontSize="$3.5" fontWeight="bold" color="$color">
            📋 Chính sách hoàn / đổi vé
          </Text>
          <Text color="gray10" fontSize="$2.5">
            • Hoàn vé miễn phí trước giờ chạy 24h.
          </Text>
          <Text color="gray10" fontSize="$2.5">
            • Phí hoàn vé 10% nếu hủy trước 12h khởi hành.
          </Text>
        </Card>

        {/* Giá và nút chọn */}
        <Card
          p="$3.5"
          borderWidth={1}
          borderColor="gray5"
          br="$4"
          gap="$2"
        >
          <XStack jc="space-between" ai="center">
            <YStack>
              <Text color="gray10" fontSize="$2">Giá vé trọn gói:</Text>
              <Text fontSize="$7" color="red10" fontWeight="900">
                {Number(ticket.price).toLocaleString('vi-VN')} đ
              </Text>
            </YStack>

            <Button
              size="md"
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
    </ScrollView>
  );
}
