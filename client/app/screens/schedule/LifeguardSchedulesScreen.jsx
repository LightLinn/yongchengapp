import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLifeguardId, fetchLifeguardSchedules } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataTable } from 'react-native-paper';

const LifeguardSchedulesScreen = () => {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [schedules, setSchedules] = useState([]);
  const [lifeguardId, setLifeguardId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(moment().format('YYYY-MM'));
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadLifeguardId();
  }, []);

  useEffect(() => {
    if (lifeguardId) {
      loadSchedules();
    }
  }, [lifeguardId, month]);

  const loadLifeguardId = async () => {
    try {
      const data = await fetchLifeguardId(userId);
      setLifeguardId(data.id);
    } catch (error) {
      console.error('Failed to load lifeguard ID', error);
      Alert.alert('無法加載救生員ID');
    }
  };

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const data = await fetchLifeguardSchedules(lifeguardId, month);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules', error);
      Alert.alert('無法加載班表');
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
    const dailySchedules = schedules.filter(schedule => schedule.date === selectedDate);
    return dailySchedules.map(schedule => (
      <View key={schedule.id} style={styles.detailCard}>
        <Text style={styles.cardText}>場地 {schedule.venue_name}</Text>
        <Text style={styles.cardText}>時間 {moment(schedule.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(schedule.end_time, 'HH:mm:ss').format('HH:mm')}</Text>
      </View>
    ));
  };

  const renderCalendarView = () => {
    const markedDates = {};
    schedules.forEach(schedule => {
      markedDates[schedule.date] = { marked: true, dotColor: COLORS.primary };
    });
    return (
      <>
        <Calendar
          current={month}
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

  const renderTableView = () => {
    const venues = Array.from(new Set(schedules.map(schedule => schedule.venue_name)));
    const dates = Array.from({ length: moment(month).daysInMonth() }, (_, i) => i + 1);

    return (
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>場地</DataTable.Title>
            {dates.map(date => (
              <DataTable.Title key={date}>{date}</DataTable.Title>
            ))}
          </DataTable.Header>
          {venues.map((venue, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{venue}</DataTable.Cell>
              {dates.map(date => {
                const dateStr = `${month}-${date.toString().padStart(2, '0')}`;
                const schedule = schedules.find(s => s.date === dateStr && s.venue_name === venue);
                return (
                  <DataTable.Cell key={date}>
                    {schedule ? `${moment(schedule.start_time, 'HH:mm:ss').format('HH:mm')} - ${moment(schedule.end_time, 'HH:mm:ss').format('HH:mm')}` : ''}
                  </DataTable.Cell>
                );
              })}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchButton: {
    padding: 10,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  switchButtonActive: {
    backgroundColor: COLORS.primary,
  },
  switchButtonText: {
    color: COLORS.white,
  },
  selectedText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: 20,
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

export default LifeguardSchedulesScreen;
