import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchEnrollmentDetails, fetchCoaches, createAssignedCourse, updateEnrollment } from '../../../api/enrollmentApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';

const EnrollmentAssignedCourseScreen = () => {
  const { enrollmentId } = useLocalSearchParams();
  const router = useRouter();
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const loadEnrollmentDetails = async () => {
      try {
        const details = await fetchEnrollmentDetails(enrollmentId);
        setEnrollmentDetails(details);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load enrollment details', error);
        setLoading(false);
      }
    };

    const loadCoaches = async () => {
      try {
        const coachesData = await fetchCoaches();
        setCoaches(coachesData);
      } catch (error) {
        console.error('Failed to fetch coaches', error);
      }
    };

    loadEnrollmentDetails();
    loadCoaches();
  }, [enrollmentId]);

  const handleAddAssignedCourse = () => {
    setAssignedCourses([...assignedCourses, { coach: '', considerHours: 24 }]);
  };

  const handleAssignedCourseChange = (index, field, value) => {
    const newAssignedCourses = [...assignedCourses];
    newAssignedCourses[index][field] = value;
    setAssignedCourses(newAssignedCourses);
  };

  const handleSubmit = async () => {
    try {
      let prevDeadline = new Date();
      for (const course of assignedCourses) {
        const newAssignedCourse = {
          ...course,
          assigned_time: prevDeadline,
          deadline: moment(prevDeadline).add(course.considerHours, 'hours').toDate(),
          enrollment_number: enrollmentDetails.enrollment_number?.id || null,
        };
        await createAssignedCourse(newAssignedCourse);
        prevDeadline = newAssignedCourse.deadline;
      }
      await updateEnrollment(enrollmentId, { ...enrollmentDetails, enrollment_status: '派課中' });
      Alert.alert('送出成功', '指派課程已成功送出');
      router.replace('/screens/course/EnrollmentListScreen'); // 使用 replace 方法以禁止返回
    } catch (error) {
      console.error('Failed to submit assigned courses', error);
      Alert.alert('送出失敗', '指派課程送出失敗');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {assignedCourses.map((course, index) => (
        <View key={index} style={styles.assignedCourseContainer}>
          <Text style={styles.label}>教練</Text>
          <ModalDropdown
            options={coaches.map((coach) => coach.user.username)}
            defaultValue={course.coach ? course.coach : '選擇教練'}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownOptions}
            dropdownTextStyle={styles.dropdownOptionText}
            onSelect={(value) => handleAssignedCourseChange(index, 'coach', coaches[value].user.username)}
          />
          <Text style={styles.label}>考慮時長（小時）</Text>
          <ModalDropdown
            options={[6, 12, 18, 24, 36, 48]}
            defaultValue={`${course.considerHours}`}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownOptions}
            dropdownTextStyle={styles.dropdownOptionText}
            onSelect={(value) => handleAssignedCourseChange(index, 'considerHours', [6, 12, 18, 24, 36, 48][value])}
          />
        </View>
      ))}
      <TouchableOpacity onPress={handleAddAssignedCourse} style={styles.addButton}>
        <Text style={styles.addButtonText}>新增指派課程</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.buttonText}>送出</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  assignedCourseContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.lightWhite,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    marginTop: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  dropdownOptions: {
    width: '70%',
    borderRadius: 5,
    marginTop: 15,
  },
  dropdownOptionText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: COLORS.tertiary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 80,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default EnrollmentAssignedCourseScreen;
