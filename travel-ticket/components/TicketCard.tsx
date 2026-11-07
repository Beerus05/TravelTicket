import React from 'react';
import { Card, XStack, YStack, Text, Button, Separator } from 'tamagui';
import { Ticket } from '../store/bookingSlice';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

interface TicketCardProps {
  ticket: Ticket;
  width?: string | number;
  onSelect: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, width = '100%', onSelect }) => {
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'flight':
        return {
          bg: isDark ? '#1E3A8A' : '#EFF6FF',
          color: isDark ? '#93C5FD' : '#1D4ED8',
          label: '✈️ Máy bay',
        };
      case 'train':
        return {
          bg: isDark ? '#7C2D12' : '#FFF7ED',
          color: isDark ? '#FDBA74' : '#C2410C',
          label: '🚆 Tàu hỏa',
        };
      case 'bus':
      default:
        return {
          bg: isDark ? '#14532D' : '#F0FDF4',
          color: isDark ? '#86EFAC' : '#15803D',
          label: '🚌 Xe khách',
        };
    }
  };

  const badge = getBadgeStyle(ticket.type);

  return (
    <Card
      width={width}
      p="$4"
      borderWidth={1}
      borderColor={isDark ? '#334155' : '#E2E8F0'}
      bg={isDark ? '#1E293B' : '#FFFFFF'}
      br="$4"
      onPress={() => onSelect(ticket)}
      mb="$3"
      cursor="pointer"
    >
      {/* Hàng trên: Badge phương tiện & Mã chuyến */}
      <XStack jc="space-between" ai="center" mb="$3">
        <XStack ai="center" gap="$2">
          <YStack px="$2.5" py="$1" br="$10" bg={badge.bg}>
            <Text fontSize={12} fontWeight="bold" color={badge.color}>
              {badge.label}
            </Text>
          </YStack>
          <Text fontSize={14} fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>
            {ticket.brand}
          </Text>
        </XStack>

        <YStack px="$2" py="$1" br="$3" bg={isDark ? '#334155' : '#F1F5F9'}>
          <Text fontSize={11} color={isDark ? '#CBD5E1' : '#475569'} fontWeight="600">
            {ticket.code}
          </Text>
        </YStack>
      </XStack>

      {/* Hành trình chính */}
      <XStack jc="space-between" ai="center" mb="$2">
        <YStack>
          <Text fontSize={18} fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
            {ticket.from}
          </Text>
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
            Điểm khởi hành
          </Text>
        </YStack>

        <YStack ai="center" px="$2">
          <Text color={isDark ? '#38BDF8' : '#0066FF'} fontSize={16} fontWeight="bold">
            ➔
          </Text>
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
            {ticket.duration}
          </Text>
        </YStack>

        <YStack ai="flex-end">
          <Text fontSize={18} fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
            {ticket.to}
          </Text>
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
            Điểm đến
          </Text>
        </YStack>
      </XStack>

      {/* Thông tin giờ đi & ghế trống */}
      <XStack jc="space-between" ai="center" mb="$3">
        <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize={12}>
          🕒 Giờ đi: <Text fontWeight="600" color={isDark ? '#F8FAFC' : '#0F172A'}>{ticket.departureTime}</Text>
        </Text>
        <Text color={isDark ? '#4ADE80' : '#16A34A'} fontSize={12} fontWeight="600">
          Còn {ticket.availableSeats ?? 10} / {ticket.totalSeats || 12} ghế
        </Text>
      </XStack>

      <Separator borderColor={isDark ? '#334155' : '#E2E8F0'} mb="$3" />

      {/* Giá tiền và nút chọn */}
      <XStack jc="space-between" ai="center">
        <YStack>
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
            Giá vé trọn gói
          </Text>
          <Text fontSize={20} color={isDark ? '#F87171' : '#DC2626'} fontWeight="800">
            {Number(ticket.price).toLocaleString('vi-VN')} đ
          </Text>
        </YStack>

        <Button
          size="sm"
          bg="#0066FF"
          br="$3"
          px="$3.5"
          onPress={() => onSelect(ticket)}
        >
          <Text color="#FFFFFF" fontWeight="bold" fontSize={13}>
            Chọn chuyến ➔
          </Text>
        </Button>
      </XStack>
    </Card>
  );
};

export default TicketCard;
