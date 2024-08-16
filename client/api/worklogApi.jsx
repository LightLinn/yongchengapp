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

export const createDailyCheckRecord = async (records) => {
  const response = await fetch(`${API_BASE_URL}/daily_check_records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to create records');
  }
  return response.json();
};

export const bulkUpdateDailyCheckRecords = async (records) => {
  const response = await fetch(`${API_BASE_URL}/daily_check_records/bulk_update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to update records');
  }
  return response.json();
};

export const fetchDailyCheckRecordsBySchedule = async (scheduleId) => {
  const response = await fetch(`${API_BASE_URL}/daily_check_records/by_schedule/?schedule=${scheduleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch daily check records by worklog');
  }
  return response.json();
};

export const fetchSpecialChecklists = async () => {
  const response = await fetch(`${API_BASE_URL}/special_checklists/`);
  if (!response.ok) {
    throw new Error('Failed to fetch special checklists');
  }
  return response.json();
};

export const createSpecialCheckRecord = async (records) => {
  const response = await fetch(`${API_BASE_URL}/special_check_records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to create records');
  }
  return response.json();
};

export const bulkUpdateSpecialCheckRecords = async (records) => {
  const response = await fetch(`${API_BASE_URL}/special_check_records/bulk_update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to update records');
  }
  return response.json();
};

export const fetchSpecialCheckRecordsBySchedule = async (scheduleId) => {
  const response = await fetch(`${API_BASE_URL}/special_check_records/by_schedule/?schedule=${scheduleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch special check records by schedule');
  }
  return response.json();
};

export const fetchPeriodicChecklists = async () => {
  const response = await fetch(`${API_BASE_URL}/periodic_checklists/`);
  if (!response.ok) {
    throw new Error('Failed to fetch periodic checklists');
  }
  return response.json();
};

export const createPeriodicCheckRecord = async (records) => {
  const response = await fetch(`${API_BASE_URL}/periodic_check_records/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to create records');
  }
  return response.json();
};

export const bulkUpdatePeriodicCheckRecords = async (records) => {
  const response = await fetch(`${API_BASE_URL}/periodic_check_records/bulk_update/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    throw new Error('Failed to update records');
  }
  return response.json();
};

export const fetchPeriodicCheckRecordsBySchedule = async (scheduleId) => {
  const response = await fetch(`${API_BASE_URL}/periodic_check_records/by_schedule/?schedule=${scheduleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch periodic check records by schedule');
  }
  return response.json();
};

export const fetchWorklogStatus = async (scheduleId) => {
  const response = await fetch(`${API_BASE_URL}/worklog/check_worklog_status/${scheduleId}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch worklog status');
  }
  return await response.json();
};

export const submitWorklog = async (worklogPayload) => {
  const response = await fetch(`${API_BASE_URL}/worklog/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(worklogPayload),
  });
  if (!response.ok) {
    throw new Error('Failed to submit worklog');
  }
  return await response.json();
};