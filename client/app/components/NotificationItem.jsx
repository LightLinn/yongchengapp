import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { useRouter } from 'expo-router';

const NotificationItem = ({ notification }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/screens/notify/NotifyDetailScreen?id=${notification.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card containerStyle={styles.card}>
        <Card.Title>{notification.title}</Card.Title>
        <Card.Divider />
        <Text style={styles.content}>
          {notification.content.length > 50 
            ? `${notification.content.substring(0, 50)}...` 
            : notification.content}
        </Text>
        <Text style={styles.timestamp}>{new Date(notification.created_at).toLocaleString()}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10, // 设置圆角
    borderWidth: 1,
    borderColor: '#ddd',
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default NotificationItem;
