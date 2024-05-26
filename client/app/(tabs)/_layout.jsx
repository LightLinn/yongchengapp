import { Tabs } from 'expo-router';
import { Icon } from 'react-native-elements';

export default function TabsLayout() {
  return (
    <Tabs>
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
        name="tweet"
        options={{
          tabBarLabel: '動態',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="comment" type="font-awesome" color={color} size={size} />
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
