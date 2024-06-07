import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

export const fetchAttendanceRecords = async () => {
  const userId = await AsyncStorage.getItem('userId');
  const response = await fetch(`${API_BASE_URL}/attendance_lists/?user=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch attendance records');
  }
  return await response.json();
};
