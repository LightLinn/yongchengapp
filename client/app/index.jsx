import React from 'react';
import { Redirect } from 'expo-router';
import { LogBox } from 'react-native';

export default function Index() {
  // 忽略所有警告消息
  LogBox.ignoreAllLogs(true);

  // 或者忽略特定的警告消息
  LogBox.ignoreLogs(['Warning: ...']);

  return <Redirect href="/screens/WelcomeScreen" />;
}
