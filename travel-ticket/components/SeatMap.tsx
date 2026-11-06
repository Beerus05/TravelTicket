import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const ALL_DEFAULT_SEATS = [
  'A1', 'A2', 'A3', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
];

interface SeatMapProps {
  bookedSeats?: string[];
  selectedSeats: string[];
  onToggleSeat: (seat: string) => void;
  seatsList?: string[];
}

export const SeatMap: React.FC<SeatMapProps> = ({
  bookedSeats = [],
  selectedSeats,
  onToggleSeat,
  seatsList = ALL_DEFAULT_SEATS,
}) => {
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';
  const rows = ['A', 'B', 'C'];

  return (
    <YStack gap="$4" ai="center" w="100%">
      {/* Chú thích màu sắc ghế */}
      <XStack gap="$4" jc="center" ai="center" mb="$1" flexWrap="wrap">
        <XStack ai="center" gap="$2">
          <YStack
            w={18}
            h={18}
            br="$2"
            bg={isDark ? '#1E293B' : '#F8FAFC'}
            borderWidth={1.5}
            borderColor={isDark ? '#475569' : '#CBD5E1'}
          />
          <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'}>Trống</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="#0066FF" />
          <Text fontSize="$3" color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold">Đang chọn</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack
            w={18}
            h={18}
            br="$2"
            bg={isDark ? '#334155' : '#E2E8F0'}
            ai="center"
            jc="center"
            borderWidth={1}
            borderColor={isDark ? '#475569' : '#CBD5E1'}
          >
            <Text fontSize={9} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="bold">✕</Text>
          </YStack>
          <Text fontSize="$3" color={isDark ? '#94A3B8' : '#64748B'}>Đã đặt (Khóa)</Text>
        </XStack>
      </XStack>

      {/* Đầu xe / Buồng lái */}
      <YStack
        w="100%"
        maxWidth={340}
        py="$2"
        bg={isDark ? '#1E293B' : '#F1F5F9'}
        br="$3"
        ai="center"
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#E2E8F0'}
      >
        <Text fontSize="$2" color={isDark ? '#94A3B8' : '#64748B'} fontWeight="600">
          🚗 PHÍA TRƯỚC / BUỒNG LÁI
        </Text>
      </YStack>

      {/* Sơ đồ ghế phân hàng với lối đi ở giữa */}
      <YStack gap="$3" w="100%" maxWidth={340}>
        {rows.map((row) => {
          const leftSeats = [`${row}1`, `${row}2`];
          const rightSeats = [`${row}3`, `${row}4`];

          const renderSeatButton = (seat: string) => {
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            let bg = isDark ? '#1E293B' : '#F8FAFC';
            let borderColor = isDark ? '#334155' : '#CBD5E1';
            let textColor = isDark ? '#F8FAFC' : '#1E293B';

            if (isBooked) {
              bg = isDark ? '#334155' : '#E2E8F0';
              borderColor = isDark ? '#475569' : '#CBD5E1';
              textColor = isDark ? '#64748B' : '#94A3B8';
            } else if (isSelected) {
              bg = '#0066FF';
              borderColor = '#0066FF';
              textColor = '#FFFFFF';
            }

            return (
              <Button
                key={seat}
                w={58}
                h={44}
                br="$3"
                disabled={isBooked}
                opacity={isBooked ? 0.55 : 1}
                bg={bg}
                borderWidth={1.5}
                borderColor={borderColor}
                pressStyle={{ opacity: 0.8 }}
                size="sm"
                onPress={() => {
                  if (!isBooked) {
                    onToggleSeat(seat);
                  }
                }}
              >
                <Text color={textColor} fontWeight={isSelected || isBooked ? 'bold' : '600'} fontSize="$3">
                  {isBooked ? `✕ ${seat}` : seat}
                </Text>
              </Button>
            );
          };

          return (
            <XStack key={row} jc="space-between" ai="center" w="100%">
              {/* 2 ghế bên trái */}
              <XStack gap="$2">
                {leftSeats.map(renderSeatButton)}
              </XStack>

              {/* Lối đi ở giữa */}
              <YStack w={30} ai="center">
                <Text fontSize="$2" color={isDark ? '#94A3B8' : '#64748B'}>
                  {row}
                </Text>
              </YStack>

              {/* 2 ghế bên phải */}
              <XStack gap="$2">
                {rightSeats.map(renderSeatButton)}
              </XStack>
            </XStack>
          );
        })}
      </YStack>
    </YStack>
  );
};

export default SeatMap;
