import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Button, Alert } from 'react-native';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLifeguardId, createLifeguardSchedule } from '../../../api/scheduleApi';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const LifeguardUnavailableslotsScreen = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [lifeguardId, setLifeguardId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    const loadLifeguardId = async () => {
      if (userId) {
        try {
          const lifeguard = await fetchLifeguardId(userId);
          setLifeguardId(lifeguard.id);
        } catch (error) {
          console.error('Failed to load lifeguard ID', error);
        }
      }
    };
    loadLifeguardId();
  }, [userId]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleAddSchedule = async () => {
    
    if (schedules.length >= 4) {
      Alert.alert('排休次數已達上限');
      return;
    }
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (selectedDate.getDate() > 25) {
      Alert.alert('次月班表規劃中');
      return;
    }
    try {
      const scheduleData = {
        lifeguard: lifeguardId,
        date: nextMonth.toISOString().split('T')[0],
        start_time: '07:00',
        end_time: '22:00',
        allow: false,
      };
      console.log('scheduleData', scheduleData);
      await createLifeguardSchedule(scheduleData);
      setSchedules([...schedules, scheduleData]);
      Alert.alert('排休成功');
    } catch (error) {
      console.error('Failed to create schedule', error);
      Alert.alert('排休失敗');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.subHeader}>每月25日前可提交下一個月的排休計畫</Text>
      <Button title="選擇排休日期" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>選擇的日期: {selectedDate.toISOString().split('T')[0]}</Text>
      </View>
      <Button title="添加排休" onPress={handleAddSchedule} />
      {schedules.length > 0 && (
        <View style={styles.scheduleList}>
          {schedules.map((schedule, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleText}>
                {schedule.date} {schedule.start_time} - {schedule.end_time}
              </Text>
              <Switch
                value={schedule.allow}
                style={styles.switch}
                onValueChange={(value) => {
                  const updatedSchedules = [...schedules];
                  updatedSchedules[index].allow = value;
                  setSchedules(updatedSchedules);
                }}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  dateContainer: {
    marginVertical: 20,
  },
  dateText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  scheduleList: {
    marginTop: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  scheduleText: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  switch: {
    transform: [{ scale: 0.7 }],
  },
});

export default LifeguardUnavailableslotsScreen;
