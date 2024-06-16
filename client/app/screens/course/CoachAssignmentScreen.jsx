import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchAssignments, updateAssignmentStatus } from '../../../api/assignmentApi';
import AssignmentItem from '../../components/AssignmentItem';
import AssignmentDetailModal from '../../components/AssignmentDetailModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CoachAssignmentScreen = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const coachId = await AsyncStorage.getItem('userId');
      const assignmentsData = await fetchAssignments(coachId);
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

  const handleDetail = (assignment) => {
    setSelectedAssignment(assignment);
    setDetailModalVisible(true);
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
            onDetail={handleDetail}
          />
        ))}
      </ScrollView>
      {selectedAssignment && (
        <AssignmentDetailModal
          visible={detailModalVisible}
          assignment={selectedAssignment}
          onClose={() => setDetailModalVisible(false)}
          onUpdate={() => loadData()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.bg,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default CoachAssignmentScreen;
