import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAssignmentsCoach = async () => {
  const userId = await AsyncStorage.getItem('userId');
  const response = await fetch(`${API_BASE_URL}/assigned_courses/?coach=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }
  return response.json();
};

export const updateAssignmentStatus = async (assignmentId, status) => {
  const response = await fetch(`${API_BASE_URL}/assigned_courses/${assignmentId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update assignment status');
  }
  return response.json();
};
