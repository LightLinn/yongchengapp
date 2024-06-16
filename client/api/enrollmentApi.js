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

export const updateEnrollmentStatus = async (enrollmentId, status, paymentAmount, paymentMethod) => {
  const token = await AsyncStorage.getItem('token');
  console.log(enrollmentId, status, paymentAmount, paymentMethod)
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
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update enrollment status');
  }
  return response.json();
};