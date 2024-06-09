import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchNewsDetail } from '../../../api/newsApi';
import { COLORS, SIZES } from '../../../styles/theme';

const NewsDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [notification, setNotification] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const date = new Date(notification?.created_at);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // getMonth() 從 0 開始，所以需要加 1
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  const loadNotificationDetail = async () => {
    try {
      const data = await fetchNewsDetail(id);
      setNotification(data);
    } catch (error) {
      console.error('Failed to load notification detail', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadNotificationDetail();
    }
  }, [id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotificationDetail();
  }, [id]);

  if (!notification) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>{notification.title}</Text>
      <Text style={styles.timestamp}>{formattedDate}</Text>
      <Text style={styles.content}>{notification.content}</Text>
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
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  content: {
    fontSize: SIZES.medium,
    lineHeight: 28,
    color: COLORS.gray3,
    marginBottom: 20,
  },
  timestamp: {
    fontSize: SIZES.xSmall,
    color: 'gray',
    paddingBottom: 10,
  },
});

export default NewsDetailScreen;
