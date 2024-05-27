import { API_BASE_URL } from './config';

export const fetchNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch notifications');
  }
};

export const fetchNotificationDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch notification detail');
  }
};
