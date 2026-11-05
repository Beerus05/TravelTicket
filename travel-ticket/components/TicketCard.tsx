import React from 'react';
import { Card, XStack, YStack, Text, Button, Separator } from 'tamagui';
import { Ticket } from '../store/bookingSlice';

interface TicketCardProps {
  ticket: Ticket;
  width?: string | number;
  onSelect: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, width = '100%', onSelect }) => {
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'flight':
        return { bg: 'blue3', color: 'blue10', label: '✈️ Máy bay' };
      case 'train':
        return { bg: 'orange3', color: 'orange10', label: '🚆 Tàu hỏa' };
      case 'bus':
      default:
        return { bg: 'green3', color: 'green10', label: '🚌 Xe khách' };
    }
  };

  const badge = getBadgeStyle(ticket.type);

  return (
    <Card
      width={width}
      p="$4"
      borderWidth={1}
      borderColor="gray5"
      br="$4"
      onPress={() => onSelect(ticket)}
      mb="$3"
      pressStyle={{ opacity: 0.9 }}
      cursor="pointer"
    >
      {/* Hàng trên: Badge phương tiện & Mã chuyến */}
      <XStack jc="space-between" ai="center" mb="$3">
        <XStack ai="center" gap="$2">
          <YStack px="$2.5" py="$1" br="$10" bg={badge.bg}>
            <Text fontSize="$2" fontWeight="bold" color={badge.color}>
              {badge.label}
            </Text>
          </YStack>
          <Text fontSize="$3" fontWeight="600" color="$color">
            {ticket.brand}
          </Text>
        </XStack>

        <YStack px="$2" py="$1" br="$3" bg="gray4">
          <Text fontSize="$2" color="gray11" fontWeight="500">
            {ticket.code}
          </Text>
        </YStack>
      </XStack>

      {/* Hành trình chính */}
      <XStack jc="space-between" ai="center" mb="$2">
        <YStack>
          <Text fontSize="$6" fontWeight="800" color="$color">
            {ticket.from}
          </Text>
          <Text fontSize="$2" color="gray10">
            Điểm khởi hành
          </Text>
        </YStack>

        <YStack ai="center" px="$2">
          <Text color="blue10" fontSize="$4" fontWeight="bold">
            ➔
          </Text>
          <Text fontSize="$2" color="gray10">
            {ticket.duration}
          </Text>
        </YStack>

        <YStack ai="flex-end">
          <Text fontSize="$6" fontWeight="800" color="$color">
            {ticket.to}
          </Text>
          <Text fontSize="$2" color="gray10">
            Điểm đến
          </Text>
        </YStack>
      </XStack>

      {/* Thông tin giờ đi & ghế trống */}
      <XStack jc="space-between" ai="center" mb="$3">
        <Text color="gray11" fontSize="$2">
          🕒 Giờ đi: <Text fontWeight="600" color="$color">{ticket.departureTime}</Text>
        </Text>
        <Text color="green10" fontSize="$2" fontWeight="600">
          Còn {ticket.availableSeats || 12} ghế
        </Text>
      </XStack>

      <Separator borderColor="gray4" mb="$3" />

      {/* Giá tiền và nút chọn */}
      <XStack jc="space-between" ai="center">
        <YStack>
          <Text fontSize="$2" color="gray10">
            Giá vé trọn gói
          </Text>
          <Text fontSize="$6" color="red10" fontWeight="800">
            {Number(ticket.price).toLocaleString('vi-VN')} đ
          </Text>
        </YStack>

        <Button
          size="sm"
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          br="$3"
          px="$3.5"
          onPress={() => onSelect(ticket)}
        >
          <Text color="#FFFFFF" fontWeight="bold" fontSize="$3">
            Chọn chuyến ➔
          </Text>
        </Button>
      </XStack>
    </Card>
  );
};

export default TicketCard;
