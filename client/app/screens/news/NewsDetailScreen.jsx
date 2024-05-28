import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchNewsDetail } from '../../../api/newsApi';

const NotifyDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loadNotificationDetail = async () => {
      try {
        const data = await fetchNewsDetail(id);
        setNotification(data);
      } catch (error) {
        console.error('Failed to load notification detail', error);
      }
    };

    if (id) {
      loadNotificationDetail();
    }
  }, [id]);

  if (!notification) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.content}>{notification.content}</Text>
      <Text style={styles.timestamp}>{new Date(notification.created_at).toLocaleString()}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default NotifyDetailScreen;
