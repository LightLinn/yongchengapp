import { API_BASE_URL } from './config'; // 确保路径正确

export const fetchVenues = async () => {
  // 这里是模拟的API调用，你可以将其替换为真实的API调用
  const response = await fetch(`${API_BASE_URL}/venues/`);
  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }
  return await response.json();
};

export const fetchVenueDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/venues/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch venue details');
  }
  return await response.json();
};

export const createVenue = async (venue) => {
  const response = await fetch(`${API_BASE_URL}/venues/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(venue),
  });
  if (!response.ok) {
    throw new Error('Failed to create venue');
  }
  return await response.json();
};

export const updateVenue = async (id, venue) => {
  const response = await fetch(`${API_BASE_URL}/venues/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(venue),
  });
  if (!response.ok) {
    throw new Error('Failed to update venue');
  }
  return await response.json();
};

