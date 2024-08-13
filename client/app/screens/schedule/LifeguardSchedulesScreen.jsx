import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLifeguardId, fetchLifeguardSchedules, signOutLifeguardSchedule } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import { submitLifeguardAttendance } from '../../../api/attendApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataTable } from 'react-native-paper';
import * as Location from 'expo-location';

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
    if (!lifeguardId) return; // 如果 lifeguardId 为空，直接返回
    setLoading(true);
    try {
      const data = await fetchLifeguardSchedules(lifeguardId, true);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules', error);
      Alert.alert('無法加載班表');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocationAndSubmitAttendance = async (schedule) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('無法獲取定位權限');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    if (!location) {
      Alert.alert('無法獲取當前位置');
      return;
    }

    if (!schedule) {
      Alert.alert('無法獲取班表資訊');
      return;
    }

    const attendanceData = {
      user: userId,
      attend_status: '簽到',
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      schedule: schedule.id,
    };

    try {
      await submitLifeguardAttendance(attendanceData);
      Alert.alert('簽到成功', '簽到成功');
      loadSchedules(); // 簽到成功後重新加載班表
    } catch (error) {
      console.error('Failed to submit attendance', error);
      let errorMessage = '無法提交簽到';
      try {
        const errorResponse = await error.response.json();
        errorMessage = errorResponse.detail || errorMessage;
      } catch {
        // 無法解析錯誤訊息，使用默認訊息
      }
      Alert.alert('簽到失敗', errorMessage);
    }
  };

  const handleDayPress = (day) => {
    const dateKey = day.dateString;
    setSelectedDate(dateKey);
  };

  const handleSignIn = (schedule) => {
    getCurrentLocationAndSubmitAttendance(schedule);
  };

  const handleSignOut = async (scheduleId) => {
    try {
      await signOutLifeguardSchedule(scheduleId);
      Alert.alert('簽退成功', '簽退成功');
      loadSchedules(); // 刷新頁面
    } catch (error) {
      console.error('Failed to sign out', error);
      Alert.alert('簽退失敗', '無法簽退');
    }
  };

  const renderScheduleDetails = () => {
    if (!selectedDate) return null;
    const dailySchedules = schedules.filter(schedule => schedule.date === selectedDate);
    return dailySchedules.map(schedule => (
      <View key={schedule.id} style={styles.detailCard}>
        <View style={styles.headerContainer}>
          <Text style={styles.dateText}>{selectedDate}</Text>
          <Text style={styles.statusText}>{schedule.schedule_status}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.cardText}>場地 {schedule.venue_name}</Text>
        <Text style={styles.cardText}>時間 {moment(schedule.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(schedule.end_time, 'HH:mm:ss').format('HH:mm')}</Text>
        {schedule.schedule_status === '待執勤' && (
          <TouchableOpacity onPress={() => handleSignIn(schedule)} style={styles.button}>
            <Text style={styles.buttonText}>簽到</Text>
          </TouchableOpacity>
        )}
        {schedule.schedule_status === '執勤中' && (
          <TouchableOpacity onPress={() => handleSignOut(schedule.id)} style={styles.button}>
            <Text style={styles.buttonText}>簽退</Text>
          </TouchableOpacity>
        )}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
  },
  statusText: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: 5,
  },
  cardText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: SIZES.xxLarge,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});

export default LifeguardSchedulesScreen;
