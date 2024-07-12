import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Trang chủ',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Hoạt động của xe',
          tabBarLabel: 'Hoạt động',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'file-document' : 'file-document-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='car'
        options={{
          title: 'Xe của tôi',
          tabBarLabel: 'Xe',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'car' : 'car-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          tabBarLabel: 'Chat',
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chat-processing' : 'chat-processing-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo mới nhất',
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bell' : 'bell-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: 'Tôi',
          title: 'Tài khoản của tôi',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'account-cog' : 'account-cog-outline'} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}

