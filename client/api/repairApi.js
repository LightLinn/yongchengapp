import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchRepairs = async () => {
  const response = await fetch(`${API_BASE_URL}/repair/`);
  if (!response.ok) {
    throw new Error('Failed to fetch repairs');
  }
  return await response.json();
};

export const fetchRepairDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/repair/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch repair detail with id ${id}`);
  }
  return await response.json();
};

export const createRepair = async (repair) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/repair/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(repair),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error data:', errorData);
    throw new Error('Failed to create repair');
  }
  return await response.json();
};

export const updateRepair = async (id, repair) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/repair/${id}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(repair),
  });
  if (!response.ok) {
    throw new Error(`Failed to update repair with id ${id}`);
  }
  return await response.json();
};