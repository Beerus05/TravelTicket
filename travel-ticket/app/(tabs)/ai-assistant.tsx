import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, ScrollView, Card, Spinner } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { api, askTravelAI, DEFAULT_TICKETS } from '../../services/api';
import { ticketService } from '../../services/ticketService';
import { Sparkles } from '../../components/Icons';

export default function AIAssistantScreen() {
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Xin chào! Mình là Trợ lý AI Du lịch Travel Ticket 🤖✨\nBạn muốn tìm vé đi đâu, xuất phát từ đâu và với ngân sách khoảng bao nhiêu? Ví dụ: "Tư vấn đi Đà Lạt cuối tuần này giá dưới 500k"',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const { data: tickets = DEFAULT_TICKETS } = useQuery({
    queryKey: ['tickets'],
    queryFn: ticketService.getAllTickets,
  });

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;
    const userMsg = textToSend.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      const reply = await askTravelAI(userMsg, tickets);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Gợi ý nhanh: Bạn có thể chọn vé xe Phương Trang (320.000đ) hoặc vé máy bay Vietnam Airlines (1.250.000đ) đi Đà Lạt!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    '🌸 Đi Đà Lạt dưới 500k',
    '🏖️ Vé bay Đà Nẵng giá rẻ',
    '🚆 Tàu hỏa Nha Trang ngắm biển',
  ];

  return (
    <YStack f={1} p="$3" bg="$background" gap="$3">
      {/* Header nhỏ */}
      <Card
        p="$3"
        br="$4"
        bg={isDark ? '#1E293B' : '#EFF6FF'}
        borderWidth={1}
        borderColor={isDark ? '#334155' : '#BFDBFE'}
      >
        <XStack ai="center" gap="$2.5">
          <Sparkles color={isDark ? '#38BDF8' : '#0066FF'} size={22} />
          <YStack f={1}>
            <Text fontSize="$3" fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'}>
              Trợ lý AI Du lịch & Săn vé
            </Text>
            <Text fontSize="$2" color={isDark ? '#94A3B8' : '#64748B'}>
              Hỗ trợ tư vấn lịch trình, so sánh giá vé và phương tiện tức thì
            </Text>
          </YStack>
        </XStack>
      </Card>

      {/* Danh sách tin nhắn */}
      <ScrollView f={1}>
        <YStack gap="$3" py="$2">
          {messages.map((m, index) => (
            <Card
              key={index}
              p="$3.5"
              alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
              bg={m.role === 'user' ? '#0066FF' : (isDark ? '#1E293B' : '#F1F5F9')}
              maxWidth="88%"
              borderWidth={1}
              borderColor={m.role === 'user' ? '#0066FF' : (isDark ? '#334155' : '#E2E8F0')}
              br="$4"
            >
              {m.role === 'ai' && (
                <Text fontSize="$2" fontWeight="bold" color={isDark ? '#38BDF8' : '#0066FF'} mb="$1">
                  🤖 Trợ lý AI
                </Text>
              )}
              <Text
                color={m.role === 'user' ? '#FFFFFF' : (isDark ? '#F8FAFC' : '#0F172A')}
                fontSize="$3"
                lineHeight={22}
              >
                {m.text}
              </Text>
            </Card>
          ))}

          {loading && (
            <XStack ai="center" gap="$2" p="$2">
              <Spinner size="small" color="#0066FF" />
              <Text color={isDark ? '#94A3B8' : '#64748B'} fontSize="$2">AI đang phân tích vé và lịch trình phù hợp...</Text>
            </XStack>
          )}
        </YStack>
      </ScrollView>

      {/* Gợi ý câu hỏi nhanh */}
      <XStack gap="$1.5" flexWrap="wrap">
        {QUICK_PROMPTS.map((q, idx) => (
          <Button
            key={idx}
            size="xs"
            br="$10"
            bg={isDark ? '#1E293B' : '#F1F5F9'}
            borderWidth={1}
            borderColor={isDark ? '#334155' : '#CBD5E1'}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => handleSend(q)}
          >
            <Text fontSize="$2" color={isDark ? '#E2E8F0' : '#1E293B'} fontWeight="600">{q}</Text>
          </Button>
        ))}
      </XStack>

      {/* Thanh nhập liệu */}
      <XStack gap="$2" ai="center">
        <Input
          f={1}
          br="$10"
          px="$3.5"
          bg={isDark ? '#1E293B' : '#FFFFFF'}
          borderColor={isDark ? '#334155' : '#CBD5E1'}
          color={isDark ? '#F8FAFC' : '#0F172A'}
          placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          placeholder="Nhập yêu cầu (VD: Đi Đà Lạt 2 ngày 1 đêm...)"
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <Button
          bg="#0066FF"
          pressStyle={{ bg: '#0052CC' }}
          size="md"
          br="$10"
          px="$4"
          onPress={() => handleSend()}
          disabled={loading || !prompt.trim()}
          opacity={loading || !prompt.trim() ? 0.6 : 1}
        >
          <Text color="#FFFFFF" fontWeight="bold">
            Gửi
          </Text>
        </Button>
      </XStack>
    </YStack>
  );
}
