// 20240730棄用
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { fetchScheduleById, submitLifeguardAttendance } from '../../../api/attendApi';
import { useAuth } from '../../../context/AuthContext';
import { COLORS, SIZES } from '../../../styles/theme';
import { Card } from 'react-native-elements';
import LoadingSpinner from '../../components/LoadingSpinner';

const LifeguardAttendScreen = () => {
  const [schedule, setSchedule] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();
  const { scheduleId, lifeguardId } = useLocalSearchParams();

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchScheduleById(scheduleId);
        setSchedule(data);
      } catch (error) {
        console.error('Failed to load schedule', error);
        Alert.alert('無法加載班表資訊');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('無法獲取定位權限');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLoading(false);
  };

  const handleSubmitAttendance = async () => {
    if (!schedule) {
      Alert.alert('無法獲取班表資訊');
      return;
    }

    if (!location) {
      Alert.alert('無法獲取當前位置');
      return;
    }

    const attendanceData = {
      user: userId,
      attend_status: '簽到',
      latitude: location.latitude,
      longitude: location.longitude,
      schedule: schedule.id,
    };
    
    try {
      const response = await submitLifeguardAttendance(attendanceData);
      Alert.alert('簽到成功', response.detail || '簽到成功');
      router.back();
    } catch (error) {
      console.error('Failed to submit attendance', error);
      const errorResponse = await error.response.json();
      Alert.alert('簽到失敗', errorResponse.detail || '無法提交簽到');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {schedule && (
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>班表詳情</Card.Title>
          <Card.Divider />
          <View style={styles.cardContent}>
            <Text style={styles.label}>救生員</Text>
            <Text style={styles.value}>{schedule.lifeguard_name} ({schedule.lifeguard_nickname})</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>地點</Text>
            <Text style={styles.value}>{schedule.venue_name}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>日期</Text>
            <Text style={styles.value}>{schedule.date}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.label}>時間</Text>
            <Text style={styles.value}>{schedule.start_time} - {schedule.end_time}</Text>
          </View>
        </Card>
      )}
      {location && (
        <View style={styles.locationContainer}>
          <Text>當前坐標 {location.latitude}, {location.longitude}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAttendance}>
        <Text style={styles.submitButtonText}>送出簽到</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.lightWhite,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: SIZES.large,
    color: COLORS.primary,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  value: {
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
  locationContainer: {
    marginVertical: 0,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});

export default LifeguardAttendScreen;
