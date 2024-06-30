// src/api/worklogApi.js
import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchWorklogs = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/worklog/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch worklogs');
  }

  return await response.json();
};

export const fetchWorklogDetail = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/worklog/${id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch worklog detail');
  }

  return await response.json();
};

export const fetchDailyChecklists = async () => {
  const response = await fetch(`${API_BASE_URL}/daily_checklists/`);
  if (!response.ok) {
    throw new Error('Failed to fetch checklists');
  }
  return response.json();
};

export const submitDailyCheckRecord = async (records) => {
  const response = await fetch(`${API_BASE_URL}/daily_check_records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to submit records');
  }
  return response.json();
};

export const fetchDailyCheckRecords = async (venueId, month) => {
  const response = await fetch(`${API_BASE_URL}/daily_check_records/?venue=${venueId}&month=${month}`);
  if (!response.ok) {
    throw new Error('Failed to fetch records');
  }
  return response.json();
};