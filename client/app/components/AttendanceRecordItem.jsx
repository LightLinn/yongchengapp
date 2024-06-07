import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { COLORS, SIZES } from '../../styles/theme';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
};

const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('zh-TW', options);
};

const AttendanceRecordItem = ({ record }) => {
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{record.course.enrollment_list.student}</Text>
        <Text style={styles.status}>{record.attend_status}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <Text style={styles.text}><Text style={styles.label}>簽到日期 </Text>{formatDate(record.created_at)} {formatTime(record.created_at)}</Text>
      {/* <Text style={styles.text}><Text style={styles.label}>簽到時間 </Text>{formatTime(record.created_at)}</Text> */}
      <Text style={styles.text}><Text style={styles.label}>課程類型 </Text>{record.course.enrollment_list.coursetype?.name || 'N/A'}</Text>
      {/* <Text style={styles.text}><Text style={styles.label}>課程狀態 </Text>{record.course.enrollment_list.enrollment_status || 'N/A'}</Text> */}
      <Text style={styles.text}><Text style={styles.label}>授課教練 </Text>{record.course.enrollment_list.coach?.user.nickname || 'N/A'}</Text>
      <Text style={styles.text}><Text style={styles.label}>上課地點 </Text>{record.course.enrollment_list.venue?.name || 'N/A'}</Text>
      {/* <Text style={styles.text}><Text style={styles.label}>備註 </Text>{record.check_note || ''}</Text> */}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: SIZES.large,
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
    marginVertical: 10,
  },
});

export default AttendanceRecordItem;
