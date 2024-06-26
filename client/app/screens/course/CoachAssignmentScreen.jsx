import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { fetchAssignmentsCoach, updateAssignmentStatus } from '../../../api/assignmentApi';
import AssignmentItem from '../../components/AssignmentItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';

const CoachAssignmentScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

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

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const filteredAssignments = assignments.filter(assignment => 
    statusFilter ? assignment.assigned_status === statusFilter : true
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        style={styles.statusFilterContainer}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => handleStatusFilter('')}>
          <Text style={[styles.statusFilter, !statusFilter && styles.activeFilter]}>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('待決定')}>
          <Text style={[styles.statusFilter, statusFilter === '待決定' && styles.activeFilter]}>待決定</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已接受')}>
          <Text style={[styles.statusFilter, statusFilter === '已接受' && styles.activeFilter]}>已接受</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已拒絕')}>
          <Text style={[styles.statusFilter, statusFilter === '已拒絕' && styles.activeFilter]}>已拒絕</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredAssignments.map((assignment) => (
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
  statusFilterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusFilter: {
    padding: 5,
    marginRight: 10,
    color: COLORS.gray2,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    justifyContent: 'first',
  },
});

export default CoachAssignmentScreen;
