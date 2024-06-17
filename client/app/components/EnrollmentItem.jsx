import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

const EnrollmentItem = ({ enrollment, onPayment, onReview, onCancel, onView, onAssign, onStop }) => {
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
      <View style={styles.buttonContainer}>
        {enrollment.enrollment_status === '待付款' && (
          <>
            <TouchableOpacity onPress={() => onPayment(enrollment)} style={styles.button1}>
              <Text style={styles.buttonText}>付款</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCancel(enrollment)} style={styles.button4}>
              <Text style={styles.buttonText}>取消</Text>
            </TouchableOpacity>
          </>
        )}
        {enrollment.enrollment_status === '審核中' && (
          <TouchableOpacity onPress={() => onReview(enrollment)} style={styles.button2}>
            <Text style={styles.buttonText}>審核</Text>
          </TouchableOpacity>
        )}
        {enrollment.enrollment_status === '派課中' && (
          <>
            <TouchableOpacity onPress={() => onAssign(enrollment)} style={styles.button2}>
              <Text style={styles.buttonText}>派課進度</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onView(enrollment)} style={styles.button3}>
              <Text style={styles.buttonText}>查看</Text>
            </TouchableOpacity>
          </>
        )}
        {enrollment.enrollment_status === '進行中' && (
          <>
            <TouchableOpacity onPress={() => onView(enrollment)} style={styles.button3}>
              <Text style={styles.buttonText}>查看</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onStop(enrollment)} style={styles.button4}>
              <Text style={styles.buttonText}>停課</Text>
            </TouchableOpacity>
          </>
        )}
        {['已完成', '已取消', '已停課'].includes(enrollment.enrollment_status) && (
          <TouchableOpacity onPress={() => onView(enrollment)} style={styles.button3}>
            <Text style={styles.buttonText}>查看</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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
  details: {
    fontSize: SIZES.medium,
    marginVertical: 5,
    color: COLORS.gray,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button1: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 5,
  },
  button2: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 5,
  },
  button3: {
    backgroundColor: COLORS.gray,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 5,
  },
  button4: {
    backgroundColor: COLORS.alert,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EnrollmentItem;
