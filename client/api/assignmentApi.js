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
  const response = await fetch(`${API_BASE_URL}/assigned_courses/${assignmentId}/update_status/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update assignment status');
  }
  return response.json();
};

export const fetchAssignedCourses = async (enrollmentNumberId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/assigned_courses/?enrollment_number=${enrollmentNumberId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch assigned courses');
  }
  return response.json();
};

export const fetchEnrollmentNumberDetails = async (enrollmentNumberId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_numbers/${enrollmentNumberId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch enrollment number details');
  }
  return response.json();
};
