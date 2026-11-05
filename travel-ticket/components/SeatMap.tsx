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
          <YStack w={18} h={18} br="$2" bg="$gray4" borderWidth={1} borderColor="$gray6" />
          <Text fontSize="$2" color="$gray11">Trống</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="$blue10" />
          <Text fontSize="$2" color="$gray11">Đang chọn</Text>
        </XStack>
        <XStack ai="center" gap="$2">
          <YStack w={18} h={18} br="$2" bg="$gray7" />
          <Text fontSize="$2" color="$gray11">Đã đặt</Text>
        </XStack>
      </XStack>

      {/* Lưới ghế */}
      <XStack flexWrap="wrap" gap="$3" jc="center" maxWidth={360}>
        {seatsList.map((seat) => {
          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          let bg = '$gray3';
          let textColor = '$color';

          if (isBooked) {
            bg = '$gray7';
            textColor = '$gray10';
          } else if (isSelected) {
            bg = '$blue10';
            textColor = 'white';
          }

          return (
            <Button
              key={seat}
              width="21%"
              disabled={isBooked}
              bg={bg}
              color={textColor}
              size="sm"
              onPress={() => onToggleSeat(seat)}
            >
              {seat}
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
};

export default SeatMap;
