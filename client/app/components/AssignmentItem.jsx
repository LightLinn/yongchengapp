import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { COLORS, SIZES } from '../../styles/theme';

const AssignmentItem = ({ assignment, onAccept, onReject }) => {
  const formattedAssigntime = moment(assignment.assigned_time).format('YYYY/MM/DD HH:mm');
  const formattedDeadline = moment(assignment.deadline).format('YYYY/MM/DD HH:mm');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>指派編號 {assignment.id}</Text>
        <Text style={styles.status}>{assignment.assigned_status}</Text>
      </View>
      <Text style={styles.dt}>開始時間 {formattedAssigntime}</Text>
      <Text style={styles.dt}>截止時間 {formattedDeadline}</Text>
      {assignment.enrollment_details.map((enrollment, index) => (
        <View key={index} style={styles.enrollmentContainer}>
          <Text style={styles.details}>課程 {enrollment.coursetype.name}</Text>
          <Text style={styles.details}>學生 {enrollment.student}</Text>
          <Text style={styles.details}>年齡 {enrollment.age} 歲</Text>
          <Text style={styles.details}>程度 {enrollment.degree}</Text>
          <Text style={styles.details}>日期 {enrollment.start_date}</Text>
          <Text style={styles.details}>時間 {enrollment.start_time}</Text>
          <Text style={styles.details}>地點 {enrollment.venue.name}</Text>
        </View>
      ))}
      {assignment.assigned_status === '待決定' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
            <Text style={styles.buttonText}>接受</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onReject} style={styles.rejectButton}>
            <Text style={styles.buttonText}>拒絕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.gray3,
  },
  details: {
    fontSize: SIZES.medium,
    marginVertical: 5,
    color: COLORS.gray,
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  enrollmentContainer: {
    marginBottom: 30,
  },
  dt: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.alert,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: COLORS.alert,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default AssignmentItem;
