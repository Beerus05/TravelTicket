import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, ScrollView, Card, Spinner } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { api, askTravelAI, DEFAULT_TICKETS } from '../../services/api';

export default function AIAssistantScreen() {
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
    queryFn: async () => {
      try {
        const res = await api.get('/tickets');
        return res.data && res.data.length > 0 ? res.data : DEFAULT_TICKETS;
      } catch {
        return DEFAULT_TICKETS;
      }
    },
  });

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    const userMsg = prompt.trim();
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

  return (
    <YStack f={1} p="$4" bg="$background" gap="$3">
      <ScrollView f={1}>
        <YStack gap="$3">
          {messages.map((m, index) => (
            <Card
              key={index}
              p="$3"
              alignSelf={m.role === 'user' ? 'flex-end' : 'flex-start'}
              bg={m.role === 'user' ? 'blue10' : 'gray4'}
              maxWidth="88%"
              borderWidth={1}
              borderColor="gray5"
              br="$4"
            >
              <Text
                color={m.role === 'user' ? 'white' : '$color'}
                fontSize="$3"
                lineHeight={20}
              >
                {m.text}
              </Text>
            </Card>
          ))}
          {loading && (
            <XStack ai="center" gap="$2" p="$2">
              <Spinner size="small" color="blue10" />
              <Text color="gray10" fontSize="$2">AI đang phân tích vé và lịch trình...</Text>
            </XStack>
          )}
        </YStack>
      </ScrollView>

      <XStack gap="$2" ai="center">
        <Input
          f={1}
          placeholder="VD: Đi Đà Lạt cuối tuần ngân sách 2 triệu..."
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Button
          theme="active"
          size="md"
          onPress={handleSend}
          disabled={loading || !prompt.trim()}
        >
          Gửi
        </Button>
      </XStack>
    </YStack>
  );
}
