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

export const updateEnrollmentStatus = async (enrollmentId, status, paymentAmount, paymentMethod, remark, coach, paymentDate) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollmentId}/update_enrollment/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      enrollment_status: status,
      payment_amount: paymentAmount,
      payment_method: paymentMethod,
      payment_date: paymentDate,
      coach: coach,
      remark: remark,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update enrollment status');
  }
  return response.json();
};

export const updateEnrollment = async (enrollmentId, updatedData) => {
  
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollmentId}/update_enrollment/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error('Failed to update enrollment');
  }
  return await response.json();
};

export const createAssignedCourse = async (courseData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/assigned_courses/create_assigned/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    throw new Error('Failed to create assigned course');
  }

  return await response.json();
};

export const fetchCoaches = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/coaches/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch coaches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching coaches:', error);
    throw error;
  }
};

export const fetchAvailableCoaches = async (enrollmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coaches/available_coach?enrollmentId=${enrollmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch available coaches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available coaches:', error);
    throw error;
  }
};

export const fetchEnrollmentNumbers = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_numbers/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch enrollment numbers');
  }

  return response.json();
};

export const createEnrollmentNumber = async (enrollmentNumberData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_numbers/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(enrollmentNumberData),
  });

  if (!response.ok) {
    throw new Error('Failed to create enrollment number');
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

export const updateEnrollmentStatusByNumber = async (enrollmentNumber, enrollmentStatus, selectedDates) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/update_status_by_number/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ enrollment_number: enrollmentNumber, enrollment_status: enrollmentStatus, selectedDates: selectedDates }),
  });
  if (!response.ok) {
    throw new Error('Failed to update enrollment status by number');
  }
  return response.json();
};

export const updateEnrollmentDirectAssignedCourse = async (enrollmentId, data, selectedDates) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/enrollment_lists/${enrollmentId}/direct_assign/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data, selectedDates),
  });

  if (!response.ok) {
    throw new Error('Failed to update enrollment');
  }
  
  return await response.json();
};