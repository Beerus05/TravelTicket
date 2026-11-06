import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Input, Spinner, Text, XStack, YStack } from 'tamagui';
import { Sparkles } from '../../components/Icons';
import { TicketCard } from '../../components/TicketCard';
import { askTravelAI, DEFAULT_TICKETS } from '../../services/api';
import { ticketService } from '../../services/ticketService';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { RootState } from '../../store/store';

export default function AIAssistantScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{
    role: 'user' | 'ai';
    text: string;
    time: string;
    tickets?: Ticket[];
  }[]>([
    {
      role: 'ai',
      text: 'Xin chào! Mình là Trợ lý AI Du lịch Travel Ticket 🤖✨\nBạn muốn tìm chuyến đi đâu, khởi hành lúc nào và với ngân sách bao nhiêu? Hãy nhắn cho mình nhé!',
      time: '08:00',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const { data: tickets = DEFAULT_TICKETS } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getAllTickets,
  });

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang phân tích
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleSelectTicket = (ticketItem: Ticket) => {
    dispatch(setSelectedTicket(ticketItem));
    router.push(`/ticket/${ticketItem.id}`);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;
    const userMsg = textToSend.trim();
    const time = getCurrentTime();

    setMessages((prev) => [...prev, { role: 'user', text: userMsg, time }]);
    setPrompt('');
    setLoading(true);

    try {
      const reply = await askTravelAI(userMsg, tickets);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: reply.text,
          time: getCurrentTime(),
          tickets: reply.tickets,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Gợi ý nhanh: Bạn có thể chọn vé xe Phương Trang (320.000đ) hoặc vé máy bay Vietnam Airlines (1.250.000đ) đi Đà Lạt!',
          time: getCurrentTime(),
          tickets: tickets.slice(0, 2),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'ai',
        text: 'Cuộc trò chuyện đã được làm mới! Bạn muốn tìm chuyến xe, tàu hỏa hay máy bay đến thành phố nào hôm nay? ✈️🚌🚆',
        time: getCurrentTime(),
      },
    ]);
  };

  const QUICK_PROMPTS = [
    '🌸 Đi Đà Lạt dưới 500k',
    '🏖️ Vé bay Đà Nẵng giá tốt',
    '🚆 Tàu hỏa Nha Trang ngắm biển',
    '🚌 Limousine Cần Thơ 165k',
    '✈️ Vé máy bay TP.HCM ➔ Hà Nội',
  ];

  const getUserInitials = (name?: string) => {
    if (!name) return 'BẠN';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ flex: 1 }}
    >
      <YStack f={1} bg="$background" p="$3" gap="$2.5">
        {/* Header thông tin Trợ lý AI */}
        <Card
          p="$3.5"
          br="$5"
          bg={isDark ? '#1E293B' : '#FFFFFF'}
          borderWidth={1}
          borderColor={isDark ? '#334155' : '#E2E8F0'}
          shadowColor={isDark ? '#000000' : '#64748B'}
          shadowOpacity={0.06}
          shadowRadius={8}
        >
          <XStack ai="center" jc="space-between">
            <XStack ai="center" gap="$3">
              <YStack
                w={42}
                h={42}
                br="$10"
                bg={isDark ? '#1E3A8A' : '#EFF6FF'}
                borderWidth={1.5}
                borderColor={isDark ? '#38BDF8' : '#0066FF'}
                jc="center"
                ai="center"
              >
                <Sparkles color={isDark ? '#38BDF8' : '#0066FF'} size={22} />
              </YStack>

              <YStack>
                <XStack ai="center" gap="$2">
                  <Text fontSize={16} fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
                    Trợ lý Du lịch AI
                  </Text>
                  <YStack px="$2" py="$0.5" br="$10" bg={isDark ? '#064E3B' : '#DCFCE7'}>
                    <Text fontSize={11} fontWeight="bold" color={isDark ? '#4ADE80' : '#15803D'}>
                      ● Trực tuyến
                    </Text>
                  </YStack>
                </XStack>
                <Text fontSize={12} color={isDark ? '#94A3B8' : '#64748B'}>
                  Tư vấn lộ trình & so sánh vé tự động
                </Text>
              </YStack>
            </XStack>

            <Button
              size="sm"
              bg={isDark ? '#334155' : '#F1F5F9'}
              borderWidth={1}
              borderColor={isDark ? '#475569' : '#CBD5E1'}
              pressStyle={{ opacity: 0.8 }}
              br="$3"
              px="$2.5"
              py="$1"
              onPress={handleResetChat}
            >
              <Text fontSize={12} fontWeight="600" color={isDark ? '#CBD5E1' : '#475569'}>
                🔄 Làm mới
              </Text>
            </Button>
          </XStack>
        </Card>

        {/* Khung cuộn tin nhắn dạng hội thoại chuẩn messaging */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m, index) => {
            const isUser = m.role === 'user';

            if (isUser) {
              return (
                <View key={index} style={styles.userRow}>
                  <View style={styles.userBubble}>
                    <RNText style={styles.userText}>{m.text}</RNText>
                    <RNText style={styles.userTime}>{m.time}</RNText>
                  </View>
                </View>
              );
            }

            return (
              <View key={index} style={styles.aiRow}>
                <View
                  style={[
                    styles.aiAvatar,
                    {
                      backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF',
                      borderColor: isDark ? '#38BDF8' : '#0066FF',
                    },
                  ]}
                >
                  <RNText style={{ fontSize: 15 }}>🤖</RNText>
                </View>

                <View style={styles.aiContentWrapper}>
                  <View
                    style={[
                      styles.aiBubble,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.aiHeader}>
                      <RNText style={[styles.aiName, { color: isDark ? '#38BDF8' : '#0066FF' }]}>
                        Travel AI
                      </RNText>
                      <RNText style={[styles.aiTime, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                        {m.time}
                      </RNText>
                    </View>

                    <RNText
                      style={[
                        styles.aiText,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {m.text}
                    </RNText>
                  </View>

                  {/* Danh sách thẻ chuyến đi được AI gợi ý */}
                  {m.tickets && m.tickets.length > 0 && (
                    <View style={styles.ticketContainer}>
                      <RNText
                        style={[
                          styles.ticketTitle,
                          { color: isDark ? '#94A3B8' : '#64748B' },
                        ]}
                      >
                        🎟️ Chuyến đi gợi ý (Chạm để xem & đặt vé):
                      </RNText>
                      {m.tickets.map((t) => (
                        <TicketCard
                          key={t.id}
                          ticket={t}
                          width="100%"
                          onSelect={handleSelectTicket}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {/* Trạng thái AI đang tư vấn */}
          {loading && (
            <View style={styles.aiRow}>
              <View
                style={[
                  styles.aiAvatar,
                  {
                    backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF',
                    borderColor: isDark ? '#38BDF8' : '#0066FF',
                  },
                ]}
              >
                <RNText style={{ fontSize: 15 }}>🤖</RNText>
              </View>
              <View
                style={[
                  styles.loadingBubble,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                  },
                ]}
              >
                <Spinner size="small" color="#0066FF" />
                <RNText style={{ fontSize: 12, color: isDark ? '#94A3B8' : '#64748B', fontWeight: '500' }}>
                  AI đang đối chiếu vé & tìm giá tốt nhất...
                </RNText>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Danh sách gợi ý câu hỏi nhanh (Gợi ý cuộn ngang tiện lợi) */}
        <YStack gap="$1.5">
          <Text fontSize={12} fontWeight="700" color={isDark ? '#94A3B8' : '#64748B'} px="$1">
            💡 Gợi ý câu hỏi nhanh:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" px="$1">
              {QUICK_PROMPTS.map((q, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  br="$10"
                  bg={isDark ? '#1E293B' : '#FFFFFF'}
                  borderWidth={1}
                  borderColor={isDark ? '#334155' : '#CBD5E1'}
                  pressStyle={{ bg: isDark ? '#334155' : '#EFF6FF', borderColor: '#0066FF' }}
                  px="$3"
                  py="$1.5"
                  onPress={() => handleSend(q)}
                >
                  <Text fontSize={12} color={isDark ? '#F8FAFC' : '#1E293B'} fontWeight="600">
                    {q}
                  </Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Thanh nhập liệu bo tròn phong cách hiện đại */}
        <XStack
          p="$1"
          bg={isDark ? '#1E293B' : '#FFFFFF'}
          borderWidth={1.5}
          borderColor={isDark ? '#334155' : '#E2E8F0'}
          br="$10"
          ai="center"
          shadowColor={isDark ? '#000000' : '#64748B'}
          shadowOpacity={0.08}
          shadowRadius={6}
        >
          <Input
            f={1}
            borderWidth={0}
            bg="transparent"
            px="$3"
            fontSize={14}
            color={isDark ? '#F8FAFC' : '#0F172A'}
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            placeholder="Nhập yêu cầu (VD: Sóc Trăng, Đà Lạt, giá rẻ...)"
            value={prompt}
            onChangeText={setPrompt}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          <Button
            w={40}
            h={40}
            br="$10"
            bg={prompt.trim() ? '#0066FF' : (isDark ? '#334155' : '#E2E8F0')}
            pressStyle={{ bg: '#0052CC' }}
            jc="center"
            ai="center"
            p={0}
            onPress={() => handleSend()}
            disabled={loading || !prompt.trim()}
          >
            <Text
              color={prompt.trim() ? '#FFFFFF' : (isDark ? '#64748B' : '#94A3B8')}
              fontSize={15}
              fontWeight="900"
            >
              ➤
            </Text>
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  userRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#0066FF',
    borderRadius: 16,
    borderBottomRightRadius: 3,
    paddingHorizontal: 13,
    paddingVertical: 8,
    maxWidth: '75%',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    textAlign: 'right',
    marginTop: 2,
  },
  aiRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 4,
    gap: 8,
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  aiContentWrapper: {
    flex: 1,
    maxWidth: '85%',
  },
  aiBubble: {
    borderRadius: 16,
    borderTopLeftRadius: 3,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    alignSelf: 'flex-start',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  aiName: {
    fontSize: 11,
    fontWeight: '800',
  },
  aiTime: {
    fontSize: 10,
  },
  aiText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  ticketContainer: {
    marginTop: 8,
    width: '100%',
  },
  ticketTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginLeft: 2,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderTopLeftRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
});
