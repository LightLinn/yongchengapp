import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Calendar } from 'react-native-calendars';
import { fetchEnrollmentDetails, fetchAvailableCoaches, createAssignedCourse, updateEnrollmentDirectAssignedCourse, updateEnrollmentStatusByNumber, fetchEnrollmentNumberDetails } from '../../../api/enrollmentApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import moment from 'moment';

const EnrollmentAssignedCourseScreen = () => {
  const { enrollmentId, enrollmentNumberId } = useLocalSearchParams();
  const router = useRouter();
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [enrollmentNumberDetails, setEnrollmentNumberDetails] = useState({ same_course_type: false, course_type_limit_reached: false });
  const [selectedDates, setSelectedDates] = useState({});
  const [number_of_sessions, setNumber_of_sessions] = useState(0);

  useEffect(() => {
    const loadEnrollmentDetails = async () => {
      try {
        const details = await fetchEnrollmentDetails(enrollmentId);
        setEnrollmentDetails(details);
        const availableCoaches = await fetchAvailableCoaches(enrollmentId);
        setCoaches(availableCoaches);
        const numberDetails = await fetchEnrollmentNumberDetails(enrollmentNumberId); 
        setEnrollmentNumberDetails(numberDetails);
        setNumber_of_sessions(details.coursetype.number_of_sessions);

        const initialDates = {};
        let currentDate = moment(details.start_date).startOf('day');
        for (let i = 0; i < details.coursetype.number_of_sessions; i++) {
          initialDates[currentDate.format('YYYY-MM-DD')] = { selected: true, selectedColor: COLORS.primary };
          currentDate = currentDate.add(7, 'days');
        }
        setSelectedDates(initialDates);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load enrollment details or available coaches', error);
        setLoading(false);
      }
    };

    loadEnrollmentDetails();
  }, [enrollmentId, enrollmentNumberId]);

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
    if (Object.keys(selectedDates).length !== number_of_sessions) {
      Alert.alert('錯誤', '請選擇上課日期');
      return;
    }

    if (!assignedCourses[index].coach) {
      Alert.alert('錯誤', '教練不可以為空');
      return;
    }

    if (!enrollmentNumberDetails.same_course_type) {
      Alert.alert('錯誤', '課程類型不同');
      return;
    }

    if (!enrollmentNumberDetails.course_type_limit_reached) {
      Alert.alert('錯誤', '課程組數不同');
      return;
    }

    try {
      await updateEnrollmentDirectAssignedCourse(enrollmentId, { 
        ...enrollmentDetails, 
        enrollment_status: '進行中', 
        coach: assignedCourses[index].coach,
        selectedDates: Object.keys(selectedDates) 
      });
      Alert.alert('直接指派成功', '已直接指派該教練');
      router.replace('/screens/course/EnrollmentListScreen'); 
    } catch (error) {
      console.error('Failed to directly assign course', error);
      Alert.alert('直接指派失敗', '無法直接指派課程');
    }
  };

  const handleAssignedCourseChange = (index, field, value) => {
    const newAssignedCourses = [...assignedCourses];
    newAssignedCourses[index][field] = value;
    setAssignedCourses(newAssignedCourses);
    console.log(newAssignedCourses);
  };

  const handleDateSelect = (day) => {
    const dateKey = day.dateString;
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[dateKey]) {
      delete newSelectedDates[dateKey];
    } else {
      if (Object.keys(newSelectedDates).length < number_of_sessions) {
        newSelectedDates[dateKey] = { selected: true, selectedColor: COLORS.primary };
      } else {
        Alert.alert('錯誤', '超過選擇上限');
        return;
      }
    }
    setSelectedDates(newSelectedDates);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedDates).length !== number_of_sessions) {
      Alert.alert('錯誤', '請選擇上課日期');
      return;
    }

    if (!enrollmentNumberDetails.same_course_type) {
      Alert.alert('錯誤', '課程類型不同');
      return;
    }

    if (!enrollmentNumberDetails.course_type_limit_reached) {
      Alert.alert('錯誤', '課程組數不同');
      return;
    }

    if (assignedCourses.length === 0) {
      Alert.alert('錯誤', '必須至少有一筆指派資料');
      return;
    }

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
      await updateEnrollmentStatusByNumber(enrollmentDetails.enrollment_number?.name, '派課中', Object.keys(selectedDates)); // update status by enrollment number and send selected dates
      Alert.alert('送出成功', '指派課程已成功送出');
      router.replace('/screens/course/EnrollmentListScreen'); // 使用 replace 方法以禁止返回
    } catch (error) {
      console.error('Failed to submit assigned courses', error);
      Alert.alert('送出失敗', '指派課程送出失敗');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.enrollmentNumberContainer}>
        <Text style={styles.enrollmentNumberLabel}>報名單號</Text>
        <TextInput style={styles.enrollmentNumberInput} value={enrollmentNumberDetails.name} editable={false} />
        <Text style={styles.enrollmentNumberLabel}>選擇上課日期</Text>
        <Text style={styles.numberSessions}>已選擇{Object.keys(selectedDates).length} / {number_of_sessions}堂課</Text>
      </View>
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={selectedDates}
        theme={{
          selectedDayBackgroundColor: COLORS.primary,
          todayTextColor: COLORS.primary,
          arrowColor: COLORS.primary,
        }}
        style={{marginBottom: 30}} 
      />
      <Text style={styles.enrollmentNumberLabel}>指派教練</Text>
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
            onSelect={(value) => handleAssignedCourseChange(index, 'coach', coaches[value].id)}
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
        <Text style={styles.addButtonText}>新增指派</Text>
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
  enrollmentNumberContainer: {
    marginBottom: 20,
  },
  enrollmentNumberLabel: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  enrollmentNumberInput: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightWhite,
    color: COLORS.gray3,
    fontSize: SIZES.medium,
    marginBottom: 20,
  },
  numberSessions: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 0,
    paddingLeft: 10,
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
    backgroundColor: COLORS.secondary,
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
    backgroundColor: COLORS.primary,
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
