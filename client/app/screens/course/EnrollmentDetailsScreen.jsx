import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchEnrollmentDetails, fetchCourses } from '../../../api/enrollmentApi';
import { useRouter, useLocalSearchParams } from 'expo-router';

const EnrollmentDetailsScreen = () => {
  const { enrollmentId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [courses, setCourses] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadDetails = async () => {
      if (enrollmentId) {
        try {
          const details = await fetchEnrollmentDetails(enrollmentId);
          setEnrollmentDetails(details);

          if (details.enrollment_number && details.enrollment_number.id) {
            const courseDetails = await fetchCourses(details.enrollment_number.id, details.enrollment_number.name);
            setCourses(courseDetails);
          }
        } catch (error) {
          console.error('Failed to load details', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadDetails();
  }, [enrollmentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {enrollmentDetails && (
        <>
          <Text style={styles.details}>報名表編號 {enrollmentDetails.enrollment_number ? enrollmentDetails.enrollment_number.name : ''}</Text>
          <Text style={styles.details}>學生姓名 {enrollmentDetails.student}</Text>
          <Text style={styles.details}>開課日期 {enrollmentDetails.start_date ? enrollmentDetails.start_date : ''}</Text>
          <Text style={styles.details}>教練姓名 {enrollmentDetails.coach && enrollmentDetails.coach.user ? enrollmentDetails.coach.user.nickname : ''}</Text>
          <Text style={styles.details}>上課場地 {enrollmentDetails.venue ? enrollmentDetails.venue.name : ''}</Text>
          <Text style={styles.details}>狀態 {enrollmentDetails.enrollment_status}</Text>
          <Text style={styles.details}>備註 {enrollmentDetails.remark}</Text>
          {/* Add more details if necessary */}
        </>
      )}
      {courses && courses.length > 0 ? (
        <>
          <Text style={styles.header}>課程詳細資料</Text>
          {courses.map((course) => (
            <View key={course.id} style={styles.courseItem}>
              <Text style={styles.details}>課程名稱 {course.enrollment_list.coursetype.name}</Text>
              <Text style={styles.details}>課程描述 {course.enrollment_list.coursetype.description}</Text>
              <Text style={styles.details}>課程價格 {course.enrollment_list.coursetype.price}</Text>
              <Text style={styles.details}>課程日期 {course.course_date}</Text>
              <Text style={styles.details}>課程時間 {course.course_time}</Text>
              <Text style={styles.details}>課程狀態 {course.course_status}</Text>
            </View>
          ))}
        </>
      ) : (
        <Text>未找到課程詳細資料</Text>
      )}
      <TouchableOpacity onPress={() => router.back()} style={styles.buttonClose}>
        <Text style={styles.buttonText}>返回</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  details: {
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  courseItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
  },
  buttonClose: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EnrollmentDetailsScreen;
