import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';

// const Stack = createNativeStackNavigator();

const GlobalStyles = {
  colors: {
    backgroundColorActive: '#773BFF',
    backgroundColorInactive: '#6C6C6C',
  },
};


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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

