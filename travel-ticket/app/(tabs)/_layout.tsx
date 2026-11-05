import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Sparkles, Ticket, User } from '../../components/Icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1.5,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 19,
        },
        headerTintColor: '#0066FF',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Home color={color as any} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color }) => <Search color={color as any} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'Trợ lý AI',
          tabBarIcon: ({ color }) => <Sparkles color={color as any} size={24} />,
        }}
      />
      <Tabs.Screen
        name="my-tickets"
        options={{
          title: 'Vé của tôi',
          tabBarIcon: ({ color }) => <Ticket color={color as any} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <User color={color as any} size={24} />,
        }}
      />
    </Tabs>
  );
}
