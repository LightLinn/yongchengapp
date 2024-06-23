import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { fetchAssignmentsCoach, updateAssignmentStatus } from '../../../api/assignmentApi';
import AssignmentItem from '../../components/AssignmentItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';

const CoachAssignmentScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const assignmentsData = await fetchAssignmentsCoach();
      setAssignments(assignmentsData);
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

  const handleAccept = async (assignmentId) => {
    try {
      await updateAssignmentStatus(assignmentId, '已接受');
      loadData();
    } catch (error) {
      console.error('Failed to accept assignment:', error);
    }
  };

  const handleReject = async (assignmentId) => {
    try {
      await updateAssignmentStatus(assignmentId, '已拒絕');
      loadData();
    } catch (error) {
      console.error('Failed to reject assignment:', error);
    }
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
        {assignments.map((assignment) => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            onAccept={() => handleAccept(assignment.id)}
            onReject={() => handleReject(assignment.id)}
          />
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
});

export default CoachAssignmentScreen;
