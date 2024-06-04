// src/components/VenueItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../styles/theme';

const VenueItem = ({ venue }) => {
  const router = useRouter();

  return (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.title}>{venue.name}</Card.Title>
      <Card.Divider />
      <Text style={styles.text}>描述: {venue.description}</Text>
      <Text style={styles.text}>人數容量: {venue.capacity}</Text>
      {/* <Text style={styles.text}>平日開放時間: {venue.weekday_open_time}</Text>
      <Text style={styles.text}>平日關閉時間: {venue.weekday_close_time}</Text>
      <Text style={styles.text}>假日開放時間: {venue.holiday_open_time}</Text>
      <Text style={styles.text}>假日關閉時間: {venue.holiday_close_time}</Text>
      <Text style={styles.text}>經度: {venue.longitude}</Text>
      <Text style={styles.text}>緯度: {venue.latitude}</Text>
      <Text style={styles.text}>地址: {venue.address || '未指定'}</Text> */}
      <Button
        title="查看詳情"
        titleStyle={{ fontSize: SIZES.medium }} // 
        buttonStyle={styles.button}
        onPress={() => router.push(`/screens/venue/VenueDetailScreen?venueId=${venue.id}`)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  
  },
  text: {
    marginBottom: 10,
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
  },
});

export default VenueItem;
