import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useAuth } from '../../../context/AuthContext';
import { fetchCoachId, fetchCoursesByCoach } from '../../../api/scheduleApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';

const CoachSchedulesScreen = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [schedules, setSchedules] = useState([]);
  const [coachId, setCoachId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    loadCoachId();
  }, []);

  useEffect(() => {
    if (coachId) {
      loadSchedules();
    }
  }, [coachId]);

  const loadCoachId = async () => {
    try {
      const data = await fetchCoachId(userId);
      setCoachId(data.id);
    } catch (error) {
      console.error('Failed to load coach ID', error);
      Alert.alert('無法加載教練ID');
    }
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const data = await fetchCoursesByCoach(coachId);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules', error);
      Alert.alert('無法加載課程');
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day) => {
    const dateKey = day.dateString;
    setSelectedDate(dateKey);
  };

  const renderScheduleDetails = () => {
    if (!selectedDate) return null;
    const dailySchedules = schedules.filter(schedule => schedule.course_date === selectedDate);
    return dailySchedules.map(schedule => (
      <View key={schedule.id} style={styles.detailCard}>
        <Text style={styles.cardText}>學生 {schedule.enrollment_list.student}</Text>
        <Text style={styles.cardText}>場地 {schedule.enrollment_list.venue.name}</Text>
        <Text style={styles.cardText}>時間 {moment(schedule.course_time, 'HH:mm:ss').format('HH:mm')} - {moment(schedule.course_time, 'HH:mm:ss').add(30, 'minutes').format('HH:mm')}</Text>
      </View>
    ));
  };

  const renderCalendarView = () => {
    const markedDates = {};
    schedules.forEach(schedule => {
      markedDates[schedule.course_date] = { marked: true, dotColor: COLORS.primary };
    });
    return (
      <>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
          }}
          hideExtraDays={true}
          hideArrows={false}
        />
        {selectedDate && (
          <>
            {renderScheduleDetails()}
          </>
        )}
      </>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      {viewMode === 'calendar' ? renderCalendarView() : renderTableView()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  detailCard: {
    backgroundColor: COLORS.lightWhite,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.gray2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: SIZES.xxLarge,
  },
});

export default CoachSchedulesScreen;
