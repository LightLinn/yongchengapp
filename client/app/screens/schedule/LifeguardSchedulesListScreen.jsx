import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSchedulesByVenueId, deleteLifeguardSchedule } from '../../../api/scheduleApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

const LifeguardSchedulesListScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { venueId, venueName } = useLocalSearchParams();

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const schedulesData = await fetchSchedulesByVenueId(venueId);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
      Alert.alert('失敗', '無法加載班表列表');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, [venueId]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      '確認刪除',
      '您確定要刪除此班表嗎？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: async () => {
            try {
              await deleteLifeguardSchedule(id);
              Alert.alert('成功', '班表已刪除');
              setSchedules(schedules.filter(schedule => schedule.id !== id));
            } catch (error) {
              console.error('Failed to delete schedule', error);
              Alert.alert('失敗', '無法刪除班表');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getMarkedDates = () => {
    const markedDates = {};
    schedules.forEach(schedule => {
      if (!markedDates[schedule.date]) {
        markedDates[schedule.date] = { marked: true };
      } else {
        markedDates[schedule.date].marked = true;
      }
    });

    if (selectedDate) {
      markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: COLORS.primary };
    }

    return markedDates;
  };

  const filteredSchedules = schedules.filter(schedule => schedule.date === selectedDate);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedules().finally(() => setRefreshing(false));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>{venueName}的班表</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
      />
      <TouchableOpacity onPress={() => router.push(`/screens/schedule/LifeguardScheduleCreateScreen?venueId=${venueId}&venueName=${venueName}`)} style={styles.addButtonIcon}>
        <FontAwesome name="plus" size={SIZES.large} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={styles.schedulesContainer}>
        {filteredSchedules.map(schedule => (
          <View key={schedule.id} style={styles.scheduleItem}>
            <Text style={styles.scheduleText}>
              {moment(schedule.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(schedule.end_time, 'HH:mm:ss').format('HH:mm')} | {schedule.lifeguard_nickname ? schedule.lifeguard_nickname : schedule.lifeguard_name}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(schedule.id)}>
              <FontAwesome name="trash" size={SIZES.large} color={COLORS.alert} />
            </TouchableOpacity>
          </View>
        ))}
        {selectedDate && filteredSchedules.length === 0 && (
          <Text style={styles.noSchedulesText}>沒有排班記錄。</Text>
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
  addButtonIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  schedulesContainer: {
    marginTop: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  scheduleText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  noSchedulesText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 20,
  },
});

export default LifeguardSchedulesListScreen;
