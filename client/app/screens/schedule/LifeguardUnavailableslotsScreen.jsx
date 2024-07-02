import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLifeguardId, fetchLifeguardUnavailableSchedules, submitUnavailableSlots } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const LifeguardUnavailableslotsScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [nextMonth, setNextMonth] = useState(moment().add(1, 'month').format('YYYY-MM'));
  const [loading, setLoading] = useState(true);
  const [lifeguardId, setLifeguardId] = useState(null);
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
      const data = await fetchLifeguardUnavailableSchedules(lifeguardId, nextMonth);
      console.log(data);
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
      await submitUnavailableSlots(lifeguardId, dates);
      Alert.alert('送出成功', '你的排休日期已送出');
      router.back();
    } catch (error) {
      console.error('Failed to submit unavailable slots', error);
      Alert.alert('送出失敗', '無法提交排休日期');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
      />
      <Text style={styles.selectedText}>
        已選擇 {Object.keys(selectedDates).length} / 4 天日期
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>送出</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
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
  },
});

export default LifeguardUnavailableslotsScreen;
