import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Home, Search, Sparkles, Ticket, User } from '../../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const themeMode = useSelector((state: RootState) => state.booking.themeMode);
  const isDark = themeMode === 'dark';

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 10);
  const tabHeight = 64 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#38BDF8' : '#0066FF',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderTopColor: isDark ? '#334155' : '#E2E8F0',
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 4,
        },
        tabBarItemStyle: {
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          marginBottom: 0,
        },
        headerStyle: {
          backgroundColor: isDark ? '#0B0F19' : '#FFFFFF',
          borderBottomColor: isDark ? '#334155' : '#E2E8F0',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: isDark ? '#F8FAFC' : '#0F172A',
        },
        headerTintColor: isDark ? '#38BDF8' : '#0066FF',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color }) => <Home color={color as any} size={22} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color }) => <Search color={color as any} size={22} />,
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'Trợ lý AI',
          tabBarIcon: ({ color }) => <Sparkles color={color as any} size={22} />,
        }}
      />
      <Tabs.Screen
        name="my-tickets"
        options={{
          title: 'Vé của tôi',
          tabBarIcon: ({ color }) => <Ticket color={color as any} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <User color={color as any} size={22} />,
        }}
      />
    </Tabs>
  );
}
