import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import NotificationItem from '../../components/NotificationItem';
import { fetchNotifications } from '../../../api/notificationApi';
import { useFocusEffect } from '@react-navigation/native';

const NotifyScreen = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const notificationData = await fetchNotifications();
      setNotifications(notificationData);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  return (
    <View style={styles.container}>
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
  list: {
    paddingBottom: 10,
  },
});

export default NotifyScreen;
