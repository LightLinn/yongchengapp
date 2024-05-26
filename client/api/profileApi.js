import { API_BASE_URL } from '../config'; // 确保路径正确

export const fetchUserProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/user-profile/`);
  return await response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/user-profile/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  return await response.json();
};
