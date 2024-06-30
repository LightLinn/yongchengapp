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

export const fetchCheckcode = async (userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/attendance_lists/get_checkcode/?user=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch checkcode');
  }
  return await response.json();
};

export const fetchLifeguardSchedules = async (lifeguardId) => {
  const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/?lifeguard_id=${lifeguardId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  return response.json();
};

export const submitLifeguardAttendance = async (attendanceData) => {
  const response = await fetch(`${API_BASE_URL}/lifeguard_attendance/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendanceData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    
    console.error(errorData.error);
    throw new Error('Failed to submit attendance');
  }
  return response.json();
};

export const fetchLifeguardId = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/lifeguards/by_user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lifeguard ID');
  }
  return response.json();
};