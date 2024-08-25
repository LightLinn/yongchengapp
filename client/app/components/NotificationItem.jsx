import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { COLORS } from '../../styles/theme';
import moment from 'moment';

const NotificationItem = ({ notification }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/screens/notify/NotifyDetailScreen?id=${notification.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card containerStyle={[styles.card, !notification.read_status && styles.unreadCard]}>
        <Card.Title>{notification.title}</Card.Title>
        <Card.Divider />
        <Text style={styles.content}>
          {notification.content.length > 50 
            ? `${notification.content.substring(0, 50)}...` 
            : notification.content}
        </Text>
        <Text style={styles.timestamp}>
          {moment(notification.created_at).format('YYYY-MM-DD HH:mm')}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  unreadCard: {
    borderColor: COLORS.secondary, // 未讀通知的邊框顏色
    borderWidth: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray2,
  },
});

export default NotificationItem;
