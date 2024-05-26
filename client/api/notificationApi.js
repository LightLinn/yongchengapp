import { API_BASE_URL } from './config'; // 确保路径正确

export const fetchNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications/`);
  return await response.json();
};
