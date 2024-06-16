import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const fetchScheduleDetail = async (coachId, locationId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coach_schedules/?coach_id=${coachId}&location_id=${locationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch schedule detail');
  }
  return await response.json();
};


export const createOrUpdateSchedule = async (schedule) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coach_schedules/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) {
    throw new Error('Failed to create or update schedule');
  }
  return await response.json();
};

export const fetchCoachId = async (userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coaches/by_user?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch coach ID');
  }
  return await response.json();
};

export const fetchLifeguardId = async (userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/lifeguards/by_user?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch lifeguard ID');
  }
  return await response.json();
};

export const createLifeguardSchedule = async (scheduleData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/unavailable_slots/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });
  if (!response.ok) {
    throw new Error('Failed to create lifeguard schedule');
  }
  return await response.json();
};