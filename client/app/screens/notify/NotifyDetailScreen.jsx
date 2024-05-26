import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchNotificationDetail } from '../../../api/notificationApi';

const NotifyDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadNotificationDetail = async () => {
      try {
        const data = await fetchNotificationDetail(id);
        setNotification(data);
      } catch (error) {
        console.error('Failed to load notification detail', error);
        // 使用演示用的数据
        const demoNotification = {
          title: '演示通知標題',
          message: '這是演示通知的詳細內容。',
          timestamp: '2024-05-01T12:00:00Z',
        };
        setNotification(demoNotification);
      }
    };

    if (id) {
      loadNotificationDetail();
    }
  }, [id]);

  if (!notification) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.timestamp}>{new Date(notification.timestamp).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default NotifyDetailScreen;
