import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};


export const fetchAttendanceRecords = async () => {
  const userId = await AsyncStorage.getItem('userId');
  const response = await fetch(`${API_BASE_URL}/attendance_lists/?user=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch attendance records');
  }
  return await response.json();
};

export const createAttendance
 = async (data) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/attendance_lists/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create attendance');
  }
  return await response.json();
};