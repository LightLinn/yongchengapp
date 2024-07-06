import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLifeguardId, submitUnavailableSlots, fetchUnavailableSlotsByMonth } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Card } from 'react-native-elements';

const LifeguardUnavailableslotsScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [nextMonth, setNextMonth] = useState(moment().add(1, 'month').format('YYYY-MM'));
  const [loading, setLoading] = useState(true);
  const [lifeguardId, setLifeguardId] = useState(null);
  const [pastSchedules, setPastSchedules] = useState([]);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initializeNextMonth = moment().add(1, 'month').format('YYYY-MM');
    setNextMonth(initializeNextMonth);
    loadLifeguardId();
  }, []);

  useEffect(() => {
    if (lifeguardId) {
      loadSchedules();
    }
  }, [lifeguardId]);

  useEffect(() => {
    if (lifeguardId) {
      loadPastSchedules();
    }
  }, [lifeguardId]);

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
    try {
      const data = await fetchUnavailableSlotsByMonth(lifeguardId, nextMonth);
      const markedDates = {};
      data.forEach(schedule => {
        markedDates[schedule.date] = { marked: true };
      });
      setSelectedDates(markedDates);
    } catch (error) {
      console.error('Failed to load schedules', error);
      Alert.alert('無法加載班表');
    } finally {
      setLoading(false);
    }
  };

  const loadPastSchedules = async () => {
    try {
      const data = await fetchUnavailableSlotsByMonth(lifeguardId);
      setPastSchedules(data);
    } catch (error) {
      console.error('Failed to load past schedules', error);
      Alert.alert('無法加載過去的排休紀錄');
    }
  };

  const handleDayPress = (day) => {
    const dateKey = day.dateString;

    if (!dateKey.startsWith(nextMonth)) {
      return;
    }

    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[dateKey]) {
      delete newSelectedDates[dateKey];
    } else {
      if (Object.keys(newSelectedDates).length < 4) {
        newSelectedDates[dateKey] = { selected: true, selectedColor: COLORS.primary };
      } else {
        Alert.alert('錯誤', '你只能選擇四天日期');
        return;
      }
    }
    setSelectedDates(newSelectedDates);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedDates).length !== 4) {
      Alert.alert('錯誤', '請選擇四天日期');
      return;
    }

    const dates = Object.keys(selectedDates);

    try {
      const response = await submitUnavailableSlots(lifeguardId, dates);
      Alert.alert('送出成功', response.detail);
      router.back();
    } catch (error) {
      console.error('Failed to submit unavailable slots', error);
      const errorResponse = await error.response.json();
      Alert.alert('送出失敗', errorResponse.detail || '無法提交排休日期');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderItem = (item) => (
    <Card containerStyle={styles.card}>
      <Text style={styles.cardText}>日期 {item.date}</Text>
      <Text style={styles.cardText}>時間 {moment(item.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(item.end_time, 'HH:mm:ss').format('HH:mm')}</Text>
    </Card>
  );

  const renderSchedules = () => {
    const sortedSchedules = pastSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
    let lastMonth = '';

    return sortedSchedules.map(schedule => {
      const month = moment(schedule.date).format('YYYY年MM月');
      const renderLabel = month !== lastMonth;
      lastMonth = month;

      return (
        <View key={schedule.id}>
          {renderLabel && <Text style={styles.sectionHeader}>{month}</Text>}
          {renderItem(schedule)}
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar
        current={nextMonth}
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        theme={{
          selectedDayBackgroundColor: COLORS.primary,
          todayTextColor: COLORS.primary,
          arrowColor: COLORS.primary,
        }}
        minDate={moment().add(1, 'month').startOf('month').format('YYYY-MM-DD')}
        maxDate={moment().add(1, 'month').endOf('month').format('YYYY-MM-DD')}
        disableMonthChange={true}
        hideExtraDays={true}
        hideArrows={true}
      />
      <Text style={styles.selectedText}>
        已選擇 {Object.keys(selectedDates).length} / 4 天日期
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>送出</Text>
        </TouchableOpacity>
      </View>
      {renderSchedules()}
      <View style={{ height: 50 }} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.medium,
  },
  historyTitle: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 20,
    paddingLeft: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
  },
  cardText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: SIZES.xxLarge,
  },
});

export default LifeguardUnavailableslotsScreen;
