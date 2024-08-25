import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchWorklogsByVenueId } from '../../../api/worklogApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import moment from 'moment';

const WorklogListScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { venueId, venueName } = useLocalSearchParams();

  const loadWorklogs = async () => {
    setLoading(true);
    try {
      const worklogsData = await fetchWorklogsByVenueId(venueId);
      setWorklogs(worklogsData);
    } catch (error) {
      console.error('Failed to fetch worklogs', error);
      Alert.alert('失敗', '無法加載工作日誌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorklogs();
  }, [venueId]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getMarkedDates = () => {
    const markedDates = {};
    
    worklogs.forEach(worklog => {
      const date = worklog.duty.date;
      if (!markedDates[date]) {
        markedDates[date] = { marked: true };
      }
    });

    if (selectedDate) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: COLORS.primary,
      };
    }

    return markedDates;
  };

  const filteredWorklogs = worklogs.filter(worklog => worklog.duty.date === selectedDate);

  const onRefresh = () => {
    setRefreshing(true);
    loadWorklogs().finally(() => setRefreshing(false));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>{venueName}的工作日誌</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      />
      <View style={styles.worklogsContainer}>
        {filteredWorklogs.map(worklog => (
          <TouchableOpacity 
            key={worklog.id} 
            style={styles.worklogItem}
            onPress={() => router.push(`/screens/worklog/WorklogDetailScreen?id=${worklog.id}`)}
          >
            <Text style={styles.worklogText}>{worklog.duty.date}</Text>
            <Text style={styles.worklogText}>
                {moment(worklog.duty.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(worklog.duty.end_time, 'HH:mm:ss').format('HH:mm')}
            </Text>
            <Text style={styles.worklogText}>使用人數 {worklog.usage_count}人</Text>
          </TouchableOpacity>
        ))}
        {selectedDate && filteredWorklogs.length === 0 && (
          <Text style={styles.noWorklogsText}>沒有日誌記錄。</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  worklogsContainer: {
    marginTop: 20,
  },
  worklogItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  worklogText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  noWorklogsText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 20,
  },
});

export default WorklogListScreen;
