import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; // 使用 Expo 提供的圖標庫
import { COLORS, SIZES } from '../../styles/theme';
import { useRouter } from 'expo-router';

const EnrollCard = ({ enroll }) => {
  const router = useRouter();

  const coach = enroll.coach?.user?.nickname || '安排中';
  const courseType = enroll.coursetype?.name || '';
  const venue = enroll.venue?.name || '';
  

  return (
    <TouchableOpacity onPress={() => router.push(`/screens/course/CourseDetailScreen?enrollment_list_id=${enroll.id}`)}>
      <Card containerStyle={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{enroll.student}</Text>
          <Text style={styles.status}>{enroll.enrollment_status}</Text>
        </View>
        <Card.Divider style={styles.divider} />
      <Text style={styles.text}><Text style={styles.label}>課程類型 </Text>{courseType}</Text>
        <Text style={styles.text}><Text style={styles.label}>授課教練 </Text>{coach}</Text>
      <Text style={styles.text}><Text style={styles.label}>上課地點 </Text>{venue}</Text>
      <Text style={styles.text}><Text style={styles.label}>課程進度 </Text>{enroll?.course_completed || 0}/{enroll?.course_total || 0}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 5,
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: COLORS.gray2,
    height: 1,
  },
  buttonContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button1: {
    backgroundColor: COLORS.alert,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button2: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button3: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default EnrollCard;
