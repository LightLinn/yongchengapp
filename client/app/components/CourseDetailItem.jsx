import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { COLORS, SIZES } from '../../styles/theme';

const CourseDetailItem = ({ course, student, venue, coach }) => {
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.titleDate}>{course.course_date}</Text>
          <Text style={styles.titleTime}>{course.course_time}</Text>
        </View>
        <Text style={styles.status}>{course.course_status || '未設定'}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button2} onPress={() => {}}>
          <Text style={styles.buttonText}>請假</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={() => {}}>
          <Text style={styles.buttonText}>調課</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1} onPress={() => {}}>
          <Text style={styles.buttonText}>簽到</Text>
        </TouchableOpacity>
      </View>
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
  headerLeft: {
    flexDirection: 'column',
  },
  titleDate: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.success,
    padding: 3,
  },
  titleTime: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.secondary,
    padding: 3,
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
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button1: {
    backgroundColor: COLORS.primary,
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
  buttonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default CourseDetailItem;
