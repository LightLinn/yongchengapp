import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchEnrollments = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch enrollments');
  }
  return response.json();
};

export const fetchEnrollmentDetails = async (enrollmentId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollmentId}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch enrollment details');
  }
  return response.json();
};

export const updateEnrollmentStatus = async (enrollmentId, status, paymentAmount, paymentMethod, remark) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollmentId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      enrollment_status: status,
      payment_amount: paymentAmount,
      payment_method: paymentMethod,
      remark: remark,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update enrollment status');
  }
  return response.json();
};

export const fetchCourses = async (enrollmentListId, enrollmentNumber) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/courses?enrollment_list_id=${enrollmentListId}&enrollment_number=${enrollmentNumber}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};