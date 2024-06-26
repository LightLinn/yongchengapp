import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, RefreshControl } from 'react-native';
import { fetchAssignedCourses } from '../../../api/assignmentApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import moment from 'moment';

const AssignedStatusScreen = () => {
  const { enrollmentNumberId } = useLocalSearchParams();
  const router = useRouter();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const coursesData = await fetchAssignedCourses(enrollmentNumberId);
      setAssignedCourses(coursesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {assignedCourses.map((course) => (
          <View key={course.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>指派教練 {course.coach_name || '待定'}</Text>
              <Text style={styles.status}>{course.assigned_status}</Text>
            </View>
            <Text style={styles.dt}>開始時間 {moment(course.assigned_time).format('YYYY/MM/DD HH:mm')}</Text>
            <Text style={styles.dt}>截止時間 {moment(course.deadline).format('YYYY/MM/DD HH:mm')}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>考慮時長 {course.decide_hours} 小時</Text>
              <Text style={styles.details}>順位 {course.rank}</Text>
              <Text style={styles.details}>備註 {course.remark}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
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
  status: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  dt: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.alert,
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  details: {
    fontSize: SIZES.medium,
    marginVertical: 5,
    color: COLORS.gray,
  },
});

export default AssignedStatusScreen;
