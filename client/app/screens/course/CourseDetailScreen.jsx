import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Card } from 'react-native-elements';
import { useLocalSearchParams } from 'expo-router';
import { fetchCourseDetails, fetchEnrollmentDetails } from '../../../api/courseApi';
import { COLORS, SIZES } from '../../../styles/theme';
import CourseDetailItem from '../../components/CourseDetailItem';

const CourseDetailScreen = () => {
  const { enrollment_list_id } = useLocalSearchParams();
  const [courseDetails, setCourseDetails] = useState([]);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDetails = async () => {
    try {
      const enrollmentData = await fetchEnrollmentDetails(enrollment_list_id);
      setEnrollmentDetails(enrollmentData);

      const courseData = await fetchCourseDetails(enrollment_list_id);
      setCourseDetails(courseData);
    } catch (error) {
      console.error('Failed to fetch details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [enrollment_list_id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDetails();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {enrollmentDetails && (
        <Card containerStyle={styles.enrollmentCard}>
          <Text style={styles.text}><Text style={styles.label}>報名狀態 </Text>{enrollmentDetails.enrollment_status}</Text>
          <Text style={styles.text}><Text style={styles.label}>課程類型 </Text>{enrollmentDetails.coursetype?.name || ''}</Text>
          <Text style={styles.text}><Text style={styles.label}>學生姓名 </Text>{enrollmentDetails.student}</Text>
          <Text style={styles.text}><Text style={styles.label}>教練姓名 </Text>{enrollmentDetails.coach?.user?.nickname || '指派中'}</Text>
          <Text style={styles.text}><Text style={styles.label}>場地名稱 </Text>{enrollmentDetails.venue?.name || ''}</Text>
          <Text style={styles.text}><Text style={styles.label}>課程費用 </Text>{enrollmentDetails.payment_amount ? enrollmentDetails.payment_amount : enrollmentDetails.coursetype.price}元</Text>
          <Text style={styles.text}><Text style={styles.label}>付款日期 </Text>{enrollmentDetails.payment_date ? enrollmentDetails.payment_date : '待付款'}</Text>
          <Text style={styles.text}><Text style={styles.label}>付款方式 </Text>{enrollmentDetails.payment_method}</Text>
          <Text style={styles.text}><Text style={styles.label}>程度描述 </Text>{enrollmentDetails.degree}</Text>
          <Text style={styles.text}><Text style={styles.label}>開課日期 </Text>{enrollmentDetails.start_date}</Text>
          <Text style={styles.text}><Text style={styles.label}>上課時間 </Text>{enrollmentDetails.start_time}</Text>
        </Card>
      )}
      {courseDetails.length > 0 ? (
        courseDetails.map((course) => (
          <CourseDetailItem
            key={course.id}
            enroll={enrollmentDetails}
            course={course}
          />
        ))
      ) : (
        <Text style={styles.noDataText}>未找到課程資料</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enrollmentCard: {
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: SIZES.medium,
    color: COLORS.gray3,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 10,
    paddingBottom: 5,
  },
  divider: {
    backgroundColor: COLORS.gray2,
    height: 1,
    marginVertical: 10,
  },
  noDataText: {
    fontSize: SIZES.medium,
    color: COLORS.alert,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CourseDetailScreen;
