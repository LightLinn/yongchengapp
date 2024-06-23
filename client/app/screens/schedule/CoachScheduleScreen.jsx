import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchScheduleDetail, createOrUpdateSchedule, fetchCoachId } from '../../../api/scheduleApi';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const timeSlots = Array.from({ length: 34 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour < 10 ? '0' : ''}${hour}:${minute}`;
});

const daysOfWeek = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

const CoachScheduleScreen = () => {
  const router = useRouter();
  const { locationId, locationName } = useLocalSearchParams();
  const [userId, setUserId] = useState(null);
  const [coachId, setCoachId] = useState(null);
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = timeSlots.reduce((acc, slot) => ({ ...acc, [slot]: false }), {});
      return acc;
    }, {})
  );

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    const loadCoachId = async () => {
      if (userId) {
        try {
          const coach = await fetchCoachId(userId);
          setCoachId(coach.id);
        } catch (error) {
          console.error('Failed to load coach ID', error);
        }
      }
    };
    loadCoachId();
  }, [userId]);

  useEffect(() => {
    const loadScheduleDetail = async () => {
      if (coachId && locationId) {
        try {
          const scheduleDetail = await fetchScheduleDetail(coachId, locationId);
          const updatedSchedule = daysOfWeek.reduce((acc, day) => {
            acc[day] = timeSlots.reduce((acc, slot) => {
              const existingSlot = scheduleDetail.find(
                (s) => s.day_of_week === day && s.time_slot === slot
              );
              acc[slot] = existingSlot ? existingSlot.is_available : false;
              return acc;
            }, {});
            return acc;
          }, {});
          setSchedule(updatedSchedule);
        } catch (error) {
          console.error('Failed to load schedule detail', error);
        }
      }
    };
    loadScheduleDetail();
  }, [coachId, locationId]);

  const toggleSwitch = async (day, slot) => {
    const newStatus = !schedule[day][slot];
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: newStatus },
    }));
    try {
      const scheduleData = {
        coach: coachId,
        location: locationId,
        day_of_week: day,
        time_slot: slot,
        is_available: newStatus,
      };
      await createOrUpdateSchedule(scheduleData);
    } catch (error) {
      console.error('Failed to update schedule', error);
      Alert.alert('排班更新失敗');
    }
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.fixedColumn}>
        <Text style={styles.title}>{locationName}</Text>
        <View style={styles.fixedCell} />
        {timeSlots.map((slot) => (
          <View key={slot} style={styles.fixedCell}>
            <Text style={styles.slotText}>{slot}</Text>
          </View>
        ))}
      </View>
      <ScrollView horizontal>
        <View style={styles.scrollableContainer}>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.column}>
              <Text style={styles.title}></Text>
              <View style={styles.dayCell}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
              {timeSlots.map((slot) => (
                <View key={slot} style={styles.cell}>
                  <Switch
                    value={schedule[day][slot]}
                    style={styles.switch}
                    onValueChange={() => toggleSwitch(day, slot)}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    backgroundColor: COLORS.lightWhite,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.gray,
    textAlign: 'center',
    padding: 10,
    height: 40,
  },
  fixedColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fixedCell: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    backgroundColor: COLORS.lightGray,
  },
  scrollableContainer: {
    flexDirection: 'row',
    marginTop: 0,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  cell: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  dayCell: {
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
  },
  dayText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  slotText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  switch: {
    transform: [{ scale: 0.7 }],
  },
});

export default CoachScheduleScreen;
