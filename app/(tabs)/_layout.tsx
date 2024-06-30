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

const AuthStack = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="signIn"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='detail'
        options={{
          headerShown: false

        }}
      />


      <Stack.Screen
        name='OTP'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
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
      {/* <Tabs.Screen
        name="activity"
        options={{
          title: 'Hoạt động mới nhất',
          tabBarLabel: 'Hoạt động',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name='car'
        options={{
          title: 'Hoạt động mới nhất',
          tabBarLabel: 'Hoạt động',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="car"
        options={{
          title: 'Xe',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

