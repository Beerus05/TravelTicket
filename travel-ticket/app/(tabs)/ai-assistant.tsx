import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner, Text, XStack, YStack } from 'tamagui';
import { Sparkles } from '../../components/Icons';
import { TicketCard } from '../../components/TicketCard';
import { askTravelAI, DEFAULT_TICKETS, AIAgentType } from '../../services/api';
import { ticketService } from '../../services/ticketService';
import { setSelectedTicket, Ticket } from '../../store/bookingSlice';
import { RootState } from '../../store/store';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  time: string;
  agentName?: string;
  agentIcon?: string;
  tickets?: Ticket[];
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, themeMode } = useSelector((state: RootState) => state.booking);
  const isDark = themeMode === 'dark';

  const [prompt, setPrompt] = useState('');
  const [activeAgent, setActiveAgent] = useState<AIAgentType>('planner');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      agentName: 'Agent Lập Lịch Trình',
      agentIcon: '🧭',
      text: 'Xin chào! Mình là Agent Lập Lịch Trình 🧭.\nBạn muốn đi Đà Lạt, Nha Trang hay Sapa? Cho mình biết số ngày bạn dự định đi để mình lên lộ trình tour trọn gói nhé!',
      time: '08:00',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<any>(null);

  const AGENT_PERSONAS = [
    {
      key: 'planner' as AIAgentType,
      label: 'Lập lịch trình',
      icon: '🧭',
      name: 'Agent Lập Lịch Trình',
      welcome:
        'Xin chào! Mình là Agent Lập Lịch Trình 🧭.\nBạn muốn đi Đà Lạt, Nha Trang hay Sapa? Cho mình biết số ngày dự định đi để mình lên lộ trình chi tiết nhé!',
    },
    {
      key: 'hunter' as AIAgentType,
      label: 'Săn vé rẻ',
      icon: '⚡',
      name: 'Agent Săn Vé Rẻ',
      welcome:
        'Chào bạn! Mình là Agent Săn Vé Rẻ ⚡.\nNgân sách của bạn là bao nhiêu (VD: dưới 500k)? Mình sẽ so sánh xe khách, tàu hỏa và máy bay để tìm vé hời nhất cho sinh viên IUH!',
    },
    {
      key: 'booking' as AIAgentType,
      label: 'Ghế & Voucher',
      icon: '🎫',
      name: 'Agent Tư Vấn Ghế & Voucher',
      welcome:
        'Xin chào! Mình là Agent Tư Vấn Ghế & Voucher 🎫.\nBạn cần chọn ghế cửa sổ ngắm cảnh, phòng nằm êm ái hay muốn áp mã giảm độc quyền sinh viên IUH (-100K)?',
    },
  ];

  const PROMPT_SUGGESTIONS: Record<AIAgentType, string[]> = {
    planner: [
      '🌸 Lịch trình Đà Lạt 2N1Đ',
      '🏖️ Tour Nha Trang biển cuối tuần',
      '🏔️ Đi Sapa săn mây Limousine',
      '✈️ Bay Đà Nẵng ngắm Cầu Rồng',
      '🚌 Xe đi Sóc Trăng / Cần Thơ',
    ],
    hunter: [
      '💰 Tìm vé dưới 500k rẻ nhất',
      '🚌 Xe khách Đà Lạt giá tốt nhất',
      '🚆 Tàu hỏa Nha Trang tiết kiệm',
      '🎓 Vé tiết kiệm cho sinh viên IUH',
      '⚡ Chuyến đi rẻ nhất hôm nay',
    ],
    booking: [
      '💺 Tàu SE4 nên chọn ghế nào đẹp?',
      '🎁 Mã giảm giá IUH dùng ra sao?',
      '🛋️ Tiện ích phòng Limousine VIP',
      '🔒 Khóa chỗ tức thì không trùng ghế',
      '📋 Chính sách đổi trả và hoàn vé',
    ],
  };

  const { data: tickets = DEFAULT_TICKETS } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getAllTickets,
  });

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleSelectTicket = (ticketItem: Ticket) => {
    dispatch(setSelectedTicket(ticketItem));
    router.push(`/ticket/${ticketItem.id}`);
  };

  const handleSwitchAgent = (agentKey: AIAgentType) => {
    if (agentKey === activeAgent) return;
    setActiveAgent(agentKey);
    const persona = AGENT_PERSONAS.find((a) => a.key === agentKey);
    if (persona) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          agentName: persona.name,
          agentIcon: persona.icon,
          text: persona.welcome,
          time: getCurrentTime(),
        },
      ]);
    }
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
      const reply = await askTravelAI(userMsg, tickets, activeAgent);
      const persona = AGENT_PERSONAS.find((a) => a.key === activeAgent);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          agentName: persona?.name || 'Travel AI',
          agentIcon: persona?.icon || '🤖',
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
          agentName: 'Travel AI',
          agentIcon: '🤖',
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
    const persona = AGENT_PERSONAS.find((a) => a.key === activeAgent) || AGENT_PERSONAS[0];
    setMessages([
      {
        role: 'ai',
        agentName: persona.name,
        agentIcon: persona.icon,
        text: persona.welcome,
        time: getCurrentTime(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={{ flex: 1 }}
    >
      <YStack f={1} bg="$background" p="$3" gap="$2.5">
        {/* Header chọn Multi-Agent chuyên sâu */}
        <View
          style={{
            padding: 10,
            borderRadius: 16,
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#E2E8F0',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <XStack ai="center" jc="space-between" mb={8}>
            <XStack ai="center" gap="$2">
              <Sparkles color={isDark ? '#38BDF8' : '#0066FF'} size={18} />
              <Text fontSize={14} fontWeight="800" color={isDark ? '#F8FAFC' : '#0F172A'}>
                Hệ thống Multi-Agent AI
              </Text>
            </XStack>

            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                backgroundColor: isDark ? '#334155' : '#F1F5F9',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: isDark ? '#475569' : '#CBD5E1',
              }}
              onPress={handleResetChat}
            >
              <RNText style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#CBD5E1' : '#475569' }}>
                🔄 Làm mới
              </RNText>
            </TouchableOpacity>
          </XStack>

          {/* 3 Tab Agent lựa chọn */}
          <XStack gap={6}>
            {AGENT_PERSONAS.map((agent) => {
              const isActive = activeAgent === agent.key;
              return (
                <TouchableOpacity
                  key={agent.key}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 36,
                    borderRadius: 10,
                    borderWidth: 1,
                    paddingHorizontal: 4,
                    gap: 4,
                    backgroundColor: isActive
                      ? '#0066FF'
                      : isDark
                      ? '#0F172A'
                      : '#F8FAFC',
                    borderColor: isActive
                      ? '#0066FF'
                      : isDark
                      ? '#334155'
                      : '#E2E8F0',
                  }}
                  onPress={() => handleSwitchAgent(agent.key)}
                >
                  <RNText style={{ fontSize: 12 }}>{agent.icon}</RNText>
                  <RNText
                    style={{
                      fontSize: 11,
                      fontWeight: isActive ? '800' : '600',
                      color: isActive ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                    }}
                    numberOfLines={1}
                  >
                    {agent.label}
                  </RNText>
                </TouchableOpacity>
              );
            })}
          </XStack>
        </View>

        {/* Khung cuộn tin nhắn dạng hội thoại chuẩn messaging */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 2 }}
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
                  <RNText style={{ fontSize: 14 }}>{m.agentIcon || '🤖'}</RNText>
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
                        {m.agentName || 'Travel AI'}
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
                <RNText style={{ fontSize: 14 }}>🤖</RNText>
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
        <YStack gap="$1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" px="$1" py="$0.5">
              {PROMPT_SUGGESTIONS[activeAgent].map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                  }}
                  onPress={() => handleSend(q)}
                >
                  <RNText
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: isDark ? '#93C5FD' : '#0066FF',
                    }}
                  >
                    {q}
                  </RNText>
                </TouchableOpacity>
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
          <TextInput
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 13,
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
            placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
            placeholder="Nhập yêu cầu (VD: Sóc Trăng, Đà Lạt, giá rẻ...)"
            value={prompt}
            onChangeText={setPrompt}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: prompt.trim() ? '#0066FF' : isDark ? '#334155' : '#E2E8F0',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => handleSend()}
            disabled={loading || !prompt.trim()}
          >
            <RNText
              style={{
                color: prompt.trim() ? '#FFFFFF' : isDark ? '#64748B' : '#94A3B8',
                fontSize: 14,
                fontWeight: '900',
              }}
            >
              ➤
            </RNText>
          </TouchableOpacity>
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
    fontSize: 13.5,
    lineHeight: 19,
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
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 13,
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
