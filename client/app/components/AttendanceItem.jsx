import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { COLORS, SIZES } from '../../styles/theme';

const CourseCard = ({ course, onSignIn }) => {
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{course.course_date}</Text>
        <Text style={styles.subtitle}>{course.course_time}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      <Text style={styles.text}>學生姓名 {course.enrollment_list.student}</Text>
      <Text style={styles.text}>教練姓名 {course.enrollment_list.coach?.user.nickname || ''}</Text>
      <Text style={styles.text}>課程類型 {course.enrollment_list.coursetype.name}</Text>
      <Text style={styles.text}>上課場地 {course.enrollment_list.venue.name}</Text>
      <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
        <Text style={styles.signInButtonText}>簽到</Text>
      </TouchableOpacity>
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
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  divider: {
    backgroundColor: COLORS.gray2,
    height: 1,
    marginVertical: 10,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});

export default CourseCard;
