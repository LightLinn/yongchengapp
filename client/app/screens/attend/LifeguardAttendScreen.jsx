import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchLifeguardSchedules, submitLifeguardAttendance, fetchLifeguardId } from '../../../api/attendApi';
import { useAuth } from '../../../context/AuthContext';
import * as Location from 'expo-location';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { Card } from 'react-native-elements';

const LifeguardAttendScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState(null);
  const [lifeguardId, setLifeguardId] = useState(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadLifeguardId();
    getCurrentLocation();
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
    setLoading(true);
    try {
      const data = await fetchLifeguardSchedules(lifeguardId);
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules', error);
      Alert.alert('無法加載班表');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSchedules();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('無法獲取定位權限');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSchedule) {
      Alert.alert('請選擇一個班表');
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
      schedule: selectedSchedule.id,
    };

    try {
      await submitLifeguardAttendance(attendanceData);
      Alert.alert('簽到成功');
      router.back();
    } catch (error) {
      console.error('Failed to submit attendance', error);
      Alert.alert('錯誤', '無法提交簽到，可能所在地點不在簽到範圍內');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectSchedule(item)}>
            <Card containerStyle={[styles.card, selectedSchedule && selectedSchedule.id === item.id ? styles.selected : null]}>
              <Card.Title style={styles.cardTitle}>點擊選擇班表</Card.Title>
              <Card.Divider />
              <View style={styles.cardContent}>
                <Text style={styles.label}>救生員</Text>
                <Text style={styles.value}>{item.lifeguard_name} ({item.lifeguard_nickname})</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.label}>地點</Text>
                <Text style={styles.value}>{item.venue_name}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.label}>日期</Text>
                <Text style={styles.value}>{item.date}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.label}>時間</Text>
                <Text style={styles.value}>{item.start_time} - {item.end_time}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {location && (
        <View style={styles.locationContainer}>
          <Text>當前經度: {location.latitude}</Text>
          <Text>當前緯度: {location.longitude}</Text>
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
  selected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
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
    marginVertical: 20,
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
