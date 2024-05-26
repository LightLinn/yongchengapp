import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import NotificationItem from '../../components/NotificationItem';
import { fetchNotifications } from '../../../api/notificationApi';

const NotifyScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationData = await fetchNotifications();
        setNotifications(notificationData);
        setNotifications([
          {
            id: 1,
            title: '通知標題 1',
            message: '這是通知內容 1',
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            title: '通知標題 2',
            message: '這是通知內容 2',
            timestamp: new Date().toISOString(),
          },
          {
            id: 3,
            title: '通知標題 3',
            message: '這是通知內容 3',
            timestamp: new Date().toISOString(),
          },
          {
            id: 1,
            title: '通知標題 1',
            message: '這是通知內容 1',
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            title: '通知標題 2',
            message: '這是通知內容 2',
            timestamp: new Date().toISOString(),
          },
          {
            id: 3,
            title: '通知標題 3',
            message: '這是通知內容 3',
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Failed to load notifications', error);
        // 使用演示数据
      }
    };

    loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Button
          icon={<Icon name="arrow-back" color="#333" />}
          buttonStyle={styles.backButton}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Back</Text>
      </View> */}
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  list: {
    paddingBottom: 10,
  },
});

export default NotifyScreen;
