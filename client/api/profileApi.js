import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserProfile = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return await response.json();
};


export const updateUserProfile = async (profile) => {
  const token = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('userId');

  if (!token || !userId) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to update user profile', errorData);
    throw new Error('Failed to update user profile');
  }

  return await response.json();
};

export const deleteUserAccount = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/delete_account/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok && response.status !== 204) {
    throw new Error('Failed to delete user account');
  }
  return response;
};