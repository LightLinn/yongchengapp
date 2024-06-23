import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { fetchEnrollmentDetails, fetchAvailableCoaches, createAssignedCourse, updateEnrollment } from '../../../api/enrollmentApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
        const availableCoaches = await fetchAvailableCoaches(enrollmentId);
        setCoaches(availableCoaches);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load enrollment details or available coaches', error);
        setLoading(false);
      }
    };

    loadEnrollmentDetails();
  }, [enrollmentId]);

  const handleAddAssignedCourse = () => {
    setAssignedCourses([...assignedCourses, { coach: '', considerHours: 24, rank: assignedCourses.length + 1 }]);
  };

  const handleRemoveAssignedCourse = (index) => {
    const newAssignedCourses = assignedCourses.filter((_, i) => i !== index).map((course, i) => ({
      ...course,
      rank: i + 1,
    }));
    setAssignedCourses(newAssignedCourses);
  };

  const handleDirectAssignedCourse = async (index) => {
    try {
      await updateEnrollment(enrollmentId, { ...enrollmentDetails, enrollment_status: '派課中', coach: assignedCourses[index].coach });
      Alert.alert('直接指派成功', '已直接指派該教練');
      router.replace('/screens/course/EnrollmentListScreen'); // 使用 replace 方法以禁止返回
    } catch (error) {
      console.error('Failed to directly assign course', error);
      Alert.alert('直接指派失敗', '無法直接指派課程');
    }
  };

  const handleAssignedCourseChange = (index, field, value) => {
    const newAssignedCourses = [...assignedCourses];
    newAssignedCourses[index][field] = value;
    setAssignedCourses(newAssignedCourses);
  };

  const handleSubmit = async () => {
    try {
      const assignedCoursesToSubmit = assignedCourses.map((course, index) => ({
        ...course,
        rank: index + 1,
        assigned_status: '待決定',
        enrollment_number: enrollmentDetails.enrollment_number?.id || null,
      }));

      let prevDeadline = new Date();
      for (const course of assignedCoursesToSubmit) {
        course.assigned_time = prevDeadline;
        course.deadline = moment(prevDeadline).add(course.considerHours, 'hours').toDate();
        await createAssignedCourse(course);
        prevDeadline = course.deadline;
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
          <Text style={styles.label}>順位 {course.rank}</Text>
          <Text style={styles.label}>教練</Text>
          <ModalDropdown
            options={coaches.map((coach) => `${coach.user.username} (報名 ${coach.ongoing_enrollments_count}, 課程 ${coach.ongoing_courses_count})`)}
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => handleRemoveAssignedCourse(index)} style={styles.removeButton}>
              <Text style={styles.buttonText}>刪除</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDirectAssignedCourse(index)} style={styles.directAssignButton}>
              <Text style={styles.buttonText}>直接指派</Text>
            </TouchableOpacity>
          </View>
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
  assignedCourseContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.white,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  directAssignButton: {
    backgroundColor: COLORS.alert,
    padding: 10,
    borderRadius: 50,
    flex: 1,
    alignItems: 'center',
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
