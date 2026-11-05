import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';

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
  return (
    <YStack gap="$4" ai="center" w="100%">
      {/* Chú thích màu sắc ghế */}
      <XStack gap="$4" jc="center" ai="center" mb="$2" flexWrap="wrap">
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="gray3" borderWidth={1} borderColor="gray6" />
          <Text fontSize="$3" color="gray11">Trống</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="blue10" />
          <Text fontSize="$3" color="blue10" fontWeight="bold">Đang chọn</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="gray6" ai="center" jc="center" borderWidth={1} borderColor="gray7">
            <Text fontSize={9} color="gray10" fontWeight="bold">✕</Text>
          </YStack>
          <Text fontSize="$3" color="gray10">Đã đặt (Khóa)</Text>
        </XStack>
      </XStack>

      {/* Lưới ghế */}
      <XStack flexWrap="wrap" gap="$3" jc="center" maxWidth={360}>
        {seatsList.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          let bg = 'gray3';
          let textColor = '$color';
          let borderColor = 'gray5';

          if (isBooked) {
            bg = 'gray6';
            textColor = 'gray9';
            borderColor = 'gray7';
          } else if (isSelected) {
            bg = 'blue10';
            textColor = 'white';
            borderColor = 'blue10';
          }

          return (
            <Button
              key={seat}
              width="21%"
              disabled={isBooked}
              opacity={isBooked ? 0.45 : 1}
              bg={bg}
              color={textColor}
              borderWidth={1}
              borderColor={borderColor}
              size="sm"
              onPress={() => {
                if (!isBooked) {
                  onToggleSeat(seat);
                }
              }}
            >
              {isBooked ? `✕ ${seat}` : seat}
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
};

export default SeatMap;
