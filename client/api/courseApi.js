
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const fetchCourses = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/courses/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const fetchLatestRegistration = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/registrations/latest`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const submitRegistration = async (registrationData) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/registrations/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData),
  });
  return await response.json();
};

export const fetchTodayCourses = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/courses/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const submitAttendance = async (attendanceData) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/attendances/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendanceData),
  });
  return await response.json();
};
