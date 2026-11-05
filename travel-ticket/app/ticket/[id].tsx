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

  return (
    <ScrollView f={1} bg="$background" p="$4">
      <YStack gap="$4">
        {/* Thẻ hành trình chính */}
        <Card
          p="$5"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$3"
        >
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$blue10" fontWeight="bold">
              {ticket.brand}
            </Text>
            <Text fontSize="$3" color="$gray10">
              Mã: {ticket.code}
            </Text>
          </XStack>

          <Text fontSize="$8" fontWeight="bold">
            {ticket.from} ➔ {ticket.to}
          </Text>

          <Separator my="$2" />

          <YStack gap="$2">
            <XStack jc="space-between">
              <Text color="$gray10">Giờ khởi hành:</Text>
              <Text fontWeight="600">{ticket.departureTime}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="$gray10">Thời gian di chuyển:</Text>
              <Text fontWeight="600">{ticket.duration}</Text>
            </XStack>
            <XStack jc="space-between">
              <Text color="$gray10">Số ghế còn trống:</Text>
              <Text fontWeight="600" color="$green10">
                {ticket.availableSeats || 12} ghế
              </Text>
            </XStack>
          </YStack>
        </Card>

        {/* Tiện ích & Mô tả */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <Text fontSize="$5" fontWeight="bold">Mô tả dịch vụ</Text>
          <Text color="$gray11" lineHeight={22}>
            {ticket.description || 'Chuyến đi tiện nghi, điều hòa 24/24, phục vụ nước uống và khăn lạnh miễn phí. Đón trả đúng giờ.'}
          </Text>
        </Card>

        {/* Chính sách hoàn hủy */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <Text fontSize="$5" fontWeight="bold">Chính sách hoàn / đổi vé</Text>
          <Text color="$gray11" fontSize="$3">
            • Hoàn vé miễn phí trước giờ khởi hành 24 tiếng.
          </Text>
          <Text color="$gray11" fontSize="$3">
            • Phí hoàn 10% nếu hủy trước khởi hành 12 tiếng.
          </Text>
          <Text color="$gray11" fontSize="$3">
            • Không hỗ trợ hoàn hủy vé sau khi phương tiện đã xuất phát.
          </Text>
        </Card>

        {/* Giá và nút chọn */}
        <Card
          p="$4"
          borderWidth={1}
          borderColor="$gray5"
          br="$4"
          gap="$2"
        >
          <XStack jc="space-between" ai="center">
            <YStack>
              <Text color="$gray10">Giá vé niêm yết:</Text>
              <Text fontSize="$8" color="$red10" fontWeight="bold">
                {Number(ticket.price).toLocaleString('vi-VN')} đ
              </Text>
            </YStack>

            <Button
              size="md"
              theme="active"
              onPress={handleContinue}
            >
              Chọn chỗ ngồi ➔
            </Button>
          </XStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}
