import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { PermissionsProvider } from '../context/PermissionsContext';
import { COLORS } from '../styles/theme';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { fetchNotifications } from '../api/notificationApi';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// 定義後台任務
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('Executing background fetch task');
    const notifications = await fetchNotifications();
    const pendingNotifications = notifications.filter(notification => notification.notify_status === '待傳送');

    // 推送 "待傳送" 的通知
    for (const notification of pendingNotifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.content.length > 50 
            ? `${notification.content.substring(0, 50)}...` 
            : notification.content,
        },
        trigger: null, // 即時推送
      });
    }

    console.log(`Scheduled ${pendingNotifications.length} notifications`);
    return pendingNotifications.length > 0 
      ? BackgroundFetch.BackgroundFetchResult.NewData 
      : BackgroundFetch.BackgroundFetchResult.NoData;

  } catch (error) {
    // console.error('Failed to fetch notifications in background:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});


// 註冊後台任務
async function registerBackgroundFetchAsync() {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    const status = await BackgroundFetch.getStatusAsync();
    // console.log('Background Fetch Status:', status);
    
    if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
    //   console.log('Background fetch is available');
      const taskRegistered = await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 5 * 60, // 每5分鐘檢查一次
        stopOnTerminate: false,    // 應用被終止後是否停止任務
        startOnBoot: true,         // 設備重啟後是否重新啟動任務
      });

      if (taskRegistered) {
        // console.log('Background fetch task registered successfully');
      } else {
        // console.log('Failed to register background fetch task');
      }
    } else {
    //   console.log('Background fetch is not available on this device');
    }
  } catch (error) {
    // console.error('Failed to register background fetch task:', error);
  }
}

// 在應用啟動時呼叫以確保後台任務被註冊
registerBackgroundFetchAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    async function setupNotifications() {
      // 請求通知權限
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        // console.log('Notification permissions not granted');
        return;
      }

      // 註冊後台任務
      await registerBackgroundFetchAsync();

      // 调度测试通知
      Notifications.scheduleNotificationAsync({
        content: {
          title: "測試通知",
          body: "這是一條測試通知訊息。",
        },
        trigger: null, // 立即推送
      });
    }

    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // 用戶點擊通知後的處理
      router.push('/screens/notify/NotifyScreen');
    });

    return () => subscription.remove();
  }, []);

  const navigateToAvatar = () => {
    router.replace('/screens/ProfileScreen'); 
  };

  const navigateToNotify = () => {
    router.push('/screens/notify/NotifyScreen'); 
  };

  return (
    <AuthProvider>
      <PermissionsProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen 
              name="index"
              options={{ 
                headerTitle: '',
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="(tabs)"
              options={{ 
                headerShadowVisible: false,
                headerTitle: '',
                headerRight: () => (
                  <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={navigateToNotify}>
                      <Icon name="notifications" type="material" color={COLORS.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToAvatar} style={styles.avatarIcon}>
                      <Icon name="account-circle" type="material" color={COLORS.secondary} />
                    </TouchableOpacity>
                  </View>
                ),
                headerLeft: () => (
                  <Image 
                    source={require('../assets/logo-1-4.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                  />
                ),
              }} 
            />
            <Stack.Screen 
              name="(auth)"
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="screens"
              options={{ 
                headerTitle: '',
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarIcon: {
    marginLeft: 15,
  },
  logo: {
    width: 110,
    height: 42,
  },
});

async function testBackgroundFetch() {
  try {
    const result = await BackgroundFetch.fetchAsync(BACKGROUND_FETCH_TASK);
    console.log('Manual background fetch result:', result);
  } catch (err) {
    console.error('Failed to manually fetch background task:', err);
  }
}

// 在開發環境中使用此函數進行測試
if (__DEV__) {
  testBackgroundFetch();
}