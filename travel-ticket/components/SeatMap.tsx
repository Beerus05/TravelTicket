import React, { useState } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TouchableOpacity, View } from 'react-native';

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
  vehicleType?: 'flight' | 'bus' | 'train' | string;
  vehicleName?: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  bookedSeats = [],
  selectedSeats,
  onToggleSeat,
  seatsList = ALL_DEFAULT_SEATS,
  vehicleType = 'bus',
  vehicleName = '',
}) => {
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  // Dành riêng cho xe khách: Có thể xem Tầng 1 (Dưới) hoặc Tầng 2 (Trên)
  const [busDeck, setBusDeck] = useState<'lower' | 'upper'>('lower');

  // Hàm render nút ghế chuẩn tương tác cao
  const renderSeatButton = (
    seat: string,
    options?: {
      label?: string;
      subLabel?: string;
      isWindow?: boolean;
      isAisle?: boolean;
      icon?: string;
    }
  ) => {
    const isBooked = bookedSeats.includes(seat);
    const isSelected = selectedSeats.includes(seat);

    let bg = isDark ? '#1E293B' : '#FFFFFF';
    let borderColor = isDark ? '#334155' : '#CBD5E1';
    let textColor = isDark ? '#F8FAFC' : '#0F172A';
    let subTextColor = isDark ? '#94A3B8' : '#64748B';

    if (isBooked) {
      bg = isDark ? '#334155' : '#E2E8F0';
      borderColor = isDark ? '#475569' : '#CBD5E1';
      textColor = isDark ? '#94A3B8' : '#94A3B8';
      subTextColor = isDark ? '#64748B' : '#94A3B8';
    } else if (isSelected) {
      bg = '#0066FF';
      borderColor = '#0066FF';
      textColor = '#FFFFFF';
      subTextColor = '#DBEAFE';
    }

    return (
      <TouchableOpacity
        key={seat}
        activeOpacity={isBooked ? 1 : 0.75}
        disabled={isBooked}
        onPress={() => {
          if (!isBooked) onToggleSeat(seat);
        }}
        style={{
          width: 62,
          minHeight: 52,
          borderRadius: 10,
          backgroundColor: bg,
          borderWidth: 1.5,
          borderColor: borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
          opacity: isBooked ? 0.6 : 1,
          shadowColor: isSelected ? '#0066FF' : '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.3 : 0.05,
          shadowRadius: 4,
          elevation: isSelected ? 3 : 1,
        }}
      >
        <Text
          color={textColor}
          fontWeight={isSelected || isBooked ? '900' : '700'}
          fontSize={14}
        >
          {isBooked ? `✕ ${seat}` : seat}
        </Text>
        <Text
          color={subTextColor}
          fontSize={9.5}
          fontWeight={isSelected ? 'bold' : '600'}
          mt={1}
        >
          {isBooked
            ? 'Đã đặt'
            : isSelected
            ? 'Đã chọn'
            : options?.subLabel || (options?.isWindow ? '🪟 Cửa sổ' : options?.isAisle ? '🚶 Lối đi' : 'Trống')}
        </Text>
      </TouchableOpacity>
    );
  };

  // ==========================================
  // 1. SƠ ĐỒ MÁY BAY (AIRCRAFT / FLIGHT)
  // ==========================================
  const renderFlightMap = () => {
    return (
      <YStack gap="$3" w="100%" maxWidth={360} ai="center">
        {/* Mũi máy bay bo tròn khí động học */}
        <View
          style={{
            width: '100%',
            height: 52,
            backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
            borderWidth: 1.5,
            borderColor: isDark ? '#38BDF8' : '#0066FF',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 4,
          }}
        >
          <Text fontSize={12} fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
            ✈️ BUỒNG LÁI PHI CÔNG (COCKPIT)
          </Text>
          <Text fontSize={10} color={isDark ? '#94A3B8' : '#64748B'}>
            Airbus A321 / Boeing 787
          </Text>
        </View>

        {/* Khung thân máy bay */}
        <View
          style={{
            width: '100%',
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            borderWidth: 1.5,
            borderColor: isDark ? '#334155' : '#CBD5E1',
            borderRadius: 16,
            padding: 12,
            gap: 12,
          }}
        >
          {/* Cửa thoát hiểm trước */}
          <XStack jc="space-between" px="$2">
            <Text fontSize={10} color="#DC2626" fontWeight="bold">🚪 EXIT CỬA THOÁT HIỂM</Text>
            <Text fontSize={10} color="#DC2626" fontWeight="bold">CỬA THOÁT HIỂM EXIT 🚪</Text>
          </XStack>

          {/* Hàng 1 (Khoang trước - Cửa thoát hiểm rộng chân) */}
          <YStack gap="$1.5">
            <XStack jc="space-between" ai="center">
              <Text fontSize={10.5} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'}>
                Hàng 1 (Khoang ưu tiên)
              </Text>
              <Text fontSize={9.5} color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="600">
                Rộng chân • Yên tĩnh
              </Text>
            </XStack>
            <XStack jc="space-between" ai="center">
              <XStack gap="$2">
                {renderSeatButton('A1', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
                {renderSeatButton('A2', { isAisle: true, subLabel: '🚶 Lối đi' })}
              </XStack>

              {/* Lối đi giữa máy bay */}
              <YStack w={36} ai="center">
                <Text fontSize={10} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="bold">
                  🚶 LỐI ĐI
                </Text>
              </YStack>

              <XStack gap="$2">
                {renderSeatButton('A3', { isAisle: true, subLabel: '🚶 Lối đi' })}
                {renderSeatButton('A4', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
              </XStack>
            </XStack>
          </YStack>

          {/* Hàng 2 (Ngang cánh máy bay 🪽) */}
          <YStack gap="$1.5">
            <XStack jc="space-between" ai="center">
              <Text fontSize={10.5} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'}>
                Hàng 2 (Ngang cánh máy bay 🪽)
              </Text>
              <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                Ngắm cánh bay & mây trời
              </Text>
            </XStack>
            <XStack jc="space-between" ai="center">
              <XStack gap="$2">
                {renderSeatButton('B1', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
                {renderSeatButton('B2', { isAisle: true, subLabel: '🚶 Lối đi' })}
              </XStack>

              <YStack w={36} ai="center">
                <Text fontSize={11} color={isDark ? '#64748B' : '#94A3B8'}>⬇️</Text>
              </YStack>

              <XStack gap="$2">
                {renderSeatButton('B3', { isAisle: true, subLabel: '🚶 Lối đi' })}
                {renderSeatButton('B4', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
              </XStack>
            </XStack>
          </YStack>

          {/* Hàng 3 (Khoang phổ thông) */}
          <YStack gap="$1.5">
            <XStack jc="space-between" ai="center">
              <Text fontSize={10.5} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'}>
                Hàng 3 (Khoang phổ thông)
              </Text>
              <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                Gần khoang bếp & WC
              </Text>
            </XStack>
            <XStack jc="space-between" ai="center">
              <XStack gap="$2">
                {renderSeatButton('C1', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
                {renderSeatButton('C2', { isAisle: true, subLabel: '🚶 Lối đi' })}
              </XStack>

              <YStack w={36} ai="center">
                <Text fontSize={11} color={isDark ? '#64748B' : '#94A3B8'}>⬇️</Text>
              </YStack>

              <XStack gap="$2">
                {renderSeatButton('C3', { isAisle: true, subLabel: '🚶 Lối đi' })}
                {renderSeatButton('C4', { isWindow: true, subLabel: '🪟 Cửa sổ' })}
              </XStack>
            </XStack>
          </YStack>
        </View>

        {/* Đuôi máy bay: Bếp Galley & WC */}
        <View
          style={{
            width: '100%',
            paddingVertical: 8,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#E2E8F0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontSize={11} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="600">
            🥪 KHU VỰC BẾP (GALLEY) & NHÀ VỆ SINH (LAVATORY) 🚻
          </Text>
        </View>
      </YStack>
    );
  };

  // ==========================================
  // 2. SƠ ĐỒ XE KHÁCH LIMOUSINE (BUS)
  // ==========================================
  const renderBusMap = () => {
    return (
      <YStack gap="$3" w="100%" maxWidth={360} ai="center">
        {/* Phía trước xe: Buồng lái tài xế & Cửa lên xuống */}
        <View
          style={{
            width: '100%',
            backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: isDark ? '#38BDF8' : '#0066FF',
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <XStack ai="center" gap="$2">
            <Text fontSize={18}>👨‍✈️</Text>
            <YStack>
              <Text fontSize={11} fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
                BÁC TÀI & VÔ LĂNG
              </Text>
              <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                Kính chắn gió trước
              </Text>
            </YStack>
          </XStack>

          <XStack ai="center" gap="$1.5">
            <YStack ai="flex-end">
              <Text fontSize={11} fontWeight="800" color="#16A34A">
                CỬA LÊN XE
              </Text>
              <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                Tự động
              </Text>
            </YStack>
            <Text fontSize={18}>🚪</Text>
          </XStack>
        </View>

        {/* Tab chuyển đổi tầng xe khách Limousine */}
        <XStack gap="$2" w="100%">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setBusDeck('lower')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: busDeck === 'lower' ? '#0066FF' : isDark ? '#1E293B' : '#F1F5F9',
              borderWidth: 1,
              borderColor: busDeck === 'lower' ? '#0066FF' : isDark ? '#334155' : '#CBD5E1',
            }}
          >
            <Text
              fontSize={11.5}
              fontWeight="bold"
              color={busDeck === 'lower' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            >
              🔻 TẦNG DƯỚI (A & B) • Ít say xe
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setBusDeck('upper')}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: busDeck === 'upper' ? '#0066FF' : isDark ? '#1E293B' : '#F1F5F9',
              borderWidth: 1,
              borderColor: busDeck === 'upper' ? '#0066FF' : isDark ? '#334155' : '#CBD5E1',
            }}
          >
            <Text
              fontSize={11.5}
              fontWeight="bold"
              color={busDeck === 'upper' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
            >
              🔺 TẦNG TRÊN (C) • Thoáng mát
            </Text>
          </TouchableOpacity>
        </XStack>

        {/* Thân xe khách */}
        <View
          style={{
            width: '100%',
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            borderWidth: 1.5,
            borderColor: isDark ? '#334155' : '#CBD5E1',
            borderRadius: 16,
            padding: 12,
            gap: 12,
          }}
        >
          {busDeck === 'lower' ? (
            <>
              {/* Dãy Phòng Tầng Dưới */}
              <YStack gap="$1.5">
                <XStack jc="space-between" ai="center">
                  <Text fontSize={10.5} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'}>
                    Khoang Trước (Êm ái nhất)
                  </Text>
                  <Text fontSize={9.5} color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="600">
                    Sạc Type-C • Rèm riêng tư
                  </Text>
                </XStack>
                <XStack jc="space-between" ai="center">
                  <XStack gap="$2">
                    {renderSeatButton('A1', { isWindow: true, subLabel: '🪟 Phòng 1' })}
                    {renderSeatButton('A2', { isWindow: false, subLabel: 'Phòng 2' })}
                  </XStack>

                  <YStack w={40} ai="center">
                    <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="bold" ta="center">
                      🚶 LỐI ĐI
                    </Text>
                  </YStack>

                  <XStack gap="$2">
                    {renderSeatButton('A3', { isWindow: false, subLabel: 'Phòng 3' })}
                    {renderSeatButton('A4', { isWindow: true, subLabel: '🪟 Phòng 4' })}
                  </XStack>
                </XStack>
              </YStack>

              <YStack gap="$1.5">
                <XStack jc="space-between" ai="center">
                  <Text fontSize={10.5} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'}>
                    Khoang Giữa Xe (Tầng 1)
                  </Text>
                  <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                    Nằm thẳng lưng 180°
                  </Text>
                </XStack>
                <XStack jc="space-between" ai="center">
                  <XStack gap="$2">
                    {renderSeatButton('B1', { isWindow: true, subLabel: '🪟 Phòng 5' })}
                    {renderSeatButton('B2', { isWindow: false, subLabel: 'Phòng 6' })}
                  </XStack>

                  <YStack w={40} ai="center">
                    <Text fontSize={11} color={isDark ? '#64748B' : '#94A3B8'}>⬇️</Text>
                  </YStack>

                  <XStack gap="$2">
                    {renderSeatButton('B3', { isWindow: false, subLabel: 'Phòng 7' })}
                    {renderSeatButton('B4', { isWindow: true, subLabel: '🪟 Phòng 8' })}
                  </XStack>
                </XStack>
              </YStack>
            </>
          ) : (
            <>
              {/* Dãy Phòng Tầng Trên */}
              <YStack gap="$2">
                <XStack jc="space-between" ai="center">
                  <Text fontSize={11} fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
                    Khoang Tầng 2 (Ngắm cảnh đường trường)
                  </Text>
                  <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                    Cửa sổ trời thoáng đãng
                  </Text>
                </XStack>

                <XStack jc="space-between" ai="center">
                  <XStack gap="$2">
                    {renderSeatButton('C1', { isWindow: true, subLabel: '🪟 Phòng 9' })}
                    {renderSeatButton('C2', { isWindow: false, subLabel: 'Phòng 10' })}
                  </XStack>

                  <YStack w={40} ai="center">
                    <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="bold" ta="center">
                      🚶 LỐI ĐI
                    </Text>
                  </YStack>

                  <XStack gap="$2">
                    {renderSeatButton('C3', { isWindow: false, subLabel: 'Phòng 11' })}
                    {renderSeatButton('C4', { isWindow: true, subLabel: '🪟 Phòng 12' })}
                  </XStack>
                </XStack>
              </YStack>
            </>
          )}
        </View>

        {/* Đuôi xe: Cửa thoát hiểm & Búa an toàn */}
        <View
          style={{
            width: '100%',
            paddingVertical: 8,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#E2E8F0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontSize={11} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="600">
            🔨 BÚA THOÁT HIỂM & CỬA KHẨN CẤP ĐUÔI XE 🚨
          </Text>
        </View>
      </YStack>
    );
  };

  // ==========================================
  // 3. SƠ ĐỒ TÀU HỎA (TRAIN CARRIAGE / SE)
  // ==========================================
  const renderTrainMap = () => {
    return (
      <YStack gap="$3" w="100%" maxWidth={360} ai="center">
        {/* Khớp nối toa tàu trước & WC */}
        <View
          style={{
            width: '100%',
            backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: isDark ? '#38BDF8' : '#0066FF',
            paddingHorizontal: 14,
            paddingVertical: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <XStack ai="center" gap="$1.5">
            <Text fontSize={16}>🔗</Text>
            <Text fontSize={11} fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
              NỐI TOA TRƯỚC
            </Text>
          </XStack>

          <Text fontSize={11} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="600">
            🚰 BỒN RỬA • WC 🚻
          </Text>
        </View>

        {/* 3 Khoang giường nằm mềm (Cabin 1, Cabin 2, Cabin 3) */}
        <YStack gap="$2.5" w="100%">
          {[
            {
              cabin: 1,
              title: 'Khoang 1 (Cabin 1) • 4 Giường nằm mềm',
              seats: ['A1', 'A2', 'A3', 'A4'],
            },
            {
              cabin: 2,
              title: 'Khoang 2 (Cabin 2) • 4 Giường nằm mềm',
              seats: ['B1', 'B2', 'B3', 'B4'],
            },
            {
              cabin: 3,
              title: 'Khoang 3 (Cabin 3) • 4 Giường nằm mềm',
              seats: ['C1', 'C2', 'C3', 'C4'],
            },
          ].map((c) => (
            <View
              key={c.cabin}
              style={{
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                borderWidth: 1.5,
                borderColor: isDark ? '#334155' : '#CBD5E1',
                borderRadius: 14,
                padding: 10,
                gap: 8,
              }}
            >
              <XStack jc="space-between" ai="center">
                <Text fontSize={11.5} fontWeight="800" color={isDark ? '#38BDF8' : '#0066FF'}>
                  🚆 {c.title}
                </Text>
                <Text fontSize={9.5} color={isDark ? '#94A3B8' : '#64748B'}>
                  Cửa lùa cách âm
                </Text>
              </XStack>

              <XStack jc="space-between" ai="center">
                {/* Giường trái: Tầng 1 (Dưới) & Tầng 2 (Trên) */}
                <XStack gap="$2">
                  {renderSeatButton(c.seats[0], { isWindow: true, subLabel: '🛏️ Tầng 1' })}
                  {renderSeatButton(c.seats[1], { isWindow: false, subLabel: '🛏️ Tầng 2' })}
                </XStack>

                {/* Bàn trà ở giữa khoang cạnh cửa sổ tàu */}
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text fontSize={14}>☕</Text>
                  <Text fontSize={8.5} fontWeight="bold" color={isDark ? '#94A3B8' : '#64748B'}>
                    BÀN TRÀ
                  </Text>
                </View>

                {/* Giường phải: Tầng 1 (Dưới) & Tầng 2 (Trên) */}
                <XStack gap="$2">
                  {renderSeatButton(c.seats[2], { isWindow: false, subLabel: '🛏️ Tầng 2' })}
                  {renderSeatButton(c.seats[3], { isWindow: true, subLabel: '🛏️ Tầng 1' })}
                </XStack>
              </XStack>
            </View>
          ))}
        </YStack>

        {/* Hành lang toa tàu dọc */}
        <View
          style={{
            width: '100%',
            paddingVertical: 8,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#E2E8F0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontSize={11} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="600">
            🚶 HÀNH LANG TOA TÀU (CORRIDOR) • CỬA SỔ NGẮM CẢNH 🔗 NỐI TOA SAU
          </Text>
        </View>
      </YStack>
    );
  };

  return (
    <YStack gap="$3" ai="center" w="100%">
      {/* Chú thích màu sắc ghế trực quan */}
      <XStack gap="$3" jc="center" ai="center" flexWrap="wrap">
        <XStack ai="center" gap="$1.5">
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderWidth: 1.5,
              borderColor: isDark ? '#475569' : '#CBD5E1',
            }}
          />
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>Còn trống</Text>
        </XStack>

        <XStack ai="center" gap="$1.5">
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: '#0066FF',
            }}
          />
          <Text fontSize={12} color={isDark ? '#38BDF8' : '#0066FF'} fontWeight="bold">Đang chọn</Text>
        </XStack>

        <XStack ai="center" gap="$1.5">
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              backgroundColor: isDark ? '#334155' : '#E2E8F0',
              borderWidth: 1,
              borderColor: isDark ? '#475569' : '#CBD5E1',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text fontSize={9} color={isDark ? '#94A3B8' : '#64748B'} fontWeight="bold">✕</Text>
          </View>
          <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>Đã đặt (Khóa)</Text>
        </XStack>
      </XStack>

      {/* Hiển thị sơ đồ theo loại phương tiện thực tế */}
      {vehicleType === 'flight' && renderFlightMap()}
      {vehicleType === 'bus' && renderBusMap()}
      {vehicleType === 'train' && renderTrainMap()}
      {vehicleType !== 'flight' && vehicleType !== 'bus' && vehicleType !== 'train' && renderBusMap()}
    </YStack>
  );
};

export default SeatMap;
