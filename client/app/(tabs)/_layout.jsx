import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../styles/theme';

export default function TabsLayout() {
  const [showTweetTab, setShowTweetTab] = useState(false); // 控制 tweet 頁籤的顯示

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.gray2,
        tabBarStyle: {
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: '首頁',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          tabBarLabel: '課程',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          tabBarLabel: '商城',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarLabel: '菜單',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="bars" type="font-awesome" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}