import React from 'react';
import { Card, XStack, YStack, Text, Button } from 'tamagui';
import { Ticket } from '../store/bookingSlice';

interface TicketCardProps {
  ticket: Ticket;
  width?: string | number;
  onSelect: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, width = '100%', onSelect }) => {
  const getBadgeColor = (type?: string) => {
    switch (type) {
      case 'flight':
        return 'blue10';
      case 'train':
        return 'orange10';
      case 'bus':
      default:
        return 'green10';
    }
  };

  const getVehicleLabel = (type?: string) => {
    switch (type) {
      case 'flight':
        return '✈️ Máy bay';
      case 'train':
        return '🚆 Tàu hỏa';
      case 'bus':
      default:
        return '🚌 Xe khách';
    }
  };

  return (
    <Card
      width={width}
      p="$4"
      borderWidth={1}
      borderColor="gray5"
      br="$4"
      onPress={() => onSelect(ticket)}
      mb="$3"
    >
      <XStack jc="space-between" ai="center" mb="$2">
        <Text fontSize="$2" fontWeight="bold" color={getBadgeColor(ticket.type)}>
          {getVehicleLabel(ticket.type)} • {ticket.brand}
        </Text>
        <Text fontSize="$2" color="gray10">
          Mã: {ticket.code}
        </Text>
      </XStack>

      <XStack jc="space-between" ai="center">
        <YStack gap="$1" f={1}>
          <Text fontSize="$6" fontWeight="bold">
            {ticket.from} ➔ {ticket.to}
          </Text>
          <Text color="gray10" fontSize="$3">
            Khởi hành: {ticket.departureTime}
          </Text>
          <Text color="gray10" fontSize="$2">
            Thời lượng: {ticket.duration}
          </Text>
          <Text fontSize="$6" color="red10" fontWeight="bold" mt="$2">
            {Number(ticket.price).toLocaleString('vi-VN')} đ
          </Text>
        </YStack>

        <Button
          size="sm"
          theme="active"
          onPress={() => onSelect(ticket)}
        >
          Chọn vé
        </Button>
      </XStack>
    </Card>
  );
};

export default TicketCard;
