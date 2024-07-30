import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const fetchScheduleDetail = async (coachId, locationId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coach_schedules/?coach_id=${coachId}&location_id=${locationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch schedule detail');
  }
  return await response.json();
};


export const createOrUpdateSchedule = async (schedule) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coach_schedules/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) {
    throw new Error('Failed to create or update schedule');
  }
  return await response.json();
};

export const fetchCoachId = async (userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/coaches/by_user?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch coach ID');
  }
  return await response.json();
};

export const fetchLifeguardId = async (userId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/lifeguards/by_user/?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch lifeguard ID');
  }
  return await response.json();
};

export const submitUnavailableSlots = async (lifeguardId, dates) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/unavailable_slots/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lifeguard_id: lifeguardId, dates }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to submit unavailable slots');
  }
  return await response.json();
};

export const fetchUnavailableSlotsByMonth = async (lifeguardId, month) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/unavailable_slots/?lifeguard_id=${lifeguardId}&month=${month}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch unavailable slots');
  }
  return await response.json();
};

export const fetchLifeguardSchedules = async (lifeguardId) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/by_lifeguardid/?lifeguard_id=${lifeguardId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  return response.json();
};

export const fetchCoursesByCoach = async (coachId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/courses/?coach_id=${coachId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return await response.json();
};

export const fetchLifeguards = async () => {
  const response = await fetch(`${API_BASE_URL}/lifeguards/`);
  if (!response.ok) {
    throw new Error('Failed to fetch lifeguards');
  }
  return await response.json();
};

export const createLifeguardSchedule = async (scheduleData) => {
  const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`Failed to create lifeguard schedule: ${JSON.stringify(errorResponse)}`);
  }

  return await response.json();
};

export const fetchSchedulesByVenueId = async (venueId) => {
  const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/by_venueid/?venue_id=${venueId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch schedules by venue ID');
  }
  return await response.json();
};

export const deleteLifeguardSchedule = async (id) => {
  const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete lifeguard schedule');
  }
};

export const signOutLifeguardSchedule = async (scheduleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lifeguard_schedules/${scheduleId}/sign_out/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedule_status: '已執勤' }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign out');
    }

    return await response.json();
  } catch (error) {
    console.error('Error signing out schedule:', error);
    throw error;
  }
};