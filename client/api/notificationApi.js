import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 取得Token
const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const fetchNotifications = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/notifications/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch notifications');
  }
};


export const fetchNotificationDetail = async (id) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch notification detail');
  }
};
