import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

const EnrollmentItem = ({ enrollment, onPayment, onReview }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          報名表編號 {enrollment.enrollment_number ? enrollment.enrollment_number.name : ''}
        </Text>
        <Text style={styles.status}>{enrollment.enrollment_status}</Text>
      </View>
      <Text style={styles.details}>學生姓名 {enrollment.student}</Text>
      <Text style={styles.details}>開課日期 {enrollment.start_date ? enrollment.start_date : ''}</Text>
      <Text style={styles.details}>教練姓名 {enrollment.coach && enrollment.coach.user ? enrollment.coach.user.nickname : ''}</Text>
      <Text style={styles.details}>上課場地 {enrollment.venue ? enrollment.venue.name : ''}</Text>
      {enrollment.enrollment_status === '待付款' && (
        <TouchableOpacity onPress={() => onPayment(enrollment)} style={styles.button1}>
          <Text style={styles.buttonText}>付款</Text>
        </TouchableOpacity>
      )}
      {enrollment.enrollment_status === '審核中' && (
        <TouchableOpacity onPress={() => onReview(enrollment)} style={styles.button2}>
          <Text style={styles.buttonText}>審核</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  details: {
    fontSize: SIZES.medium,
    marginVertical: 5,
  },
  button1: {
    marginTop: 10,
    backgroundColor: COLORS.tertiary,
    padding: 10,
    borderRadius: 20,
  },
  button2: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EnrollmentItem;
