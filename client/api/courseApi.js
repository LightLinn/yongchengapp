
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};


export const fetchEnrollments = async () => {
  const userId = await AsyncStorage.getItem('userId'); // 假设用户ID已经存储在AsyncStorage中
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/?user=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return await response.json();
};

export const fetchEnrollmentsCoach = async () => {
  const userId = await AsyncStorage.getItem('userId'); // 假设用户ID已经存储在AsyncStorage中
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/?coach=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return await response.json();
}

export const fetchEnrollmentDetails = async (enrollment_list_id) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollment_list_id}/`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch enrollment details');
  }
  return await response.json();
};

export const fetchCoaches = async (id = null) => {
  const url = id ? `${API_BASE_URL}/coaches/${id}/` : `${API_BASE_URL}/coaches/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch coaches');
  }
  return await response.json();
};

export const fetchCourseTypes = async (id = null) => {
  const url = id ? `${API_BASE_URL}/course_types/${id}/` : `${API_BASE_URL}/course_types/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch course types');
  }
  return await response.json();
};

export const fetchVenues = async (id = null) => {
  const url = id ? `${API_BASE_URL}/venues/${id}/` : `${API_BASE_URL}/venues/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }
  return await response.json();
};

export const fetchLatestEnrollment = async () => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userId');
  
  if (!userId) {
    throw new Error('User ID is not available');
  }

  const response = await fetch(`${API_BASE_URL}/enrollment_lists/latest/?user=${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch latest enrollment');
  }

  return await response.json();
};

export const createEnrollment = async (data) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create enrollment');
  }
  return await response.json();
};

export const fetchCourseDetails = async (enrollment_list_id) => {
  const token = await getToken();
  const userId = await AsyncStorage.getItem('userId');
  const response = await fetch(`${API_BASE_URL}/courses/?enrollment_list_id=${enrollment_list_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch course details');
  }
  return await response.json();
};