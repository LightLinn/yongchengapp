import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchBannerImages = async () => {
  const response = await fetch(`${API_BASE_URL}/banners/`);
  return await response.json();
};

export const fetchNews = async () => {
  const response = await fetch(`${API_BASE_URL}/news/`);
  return await response.json();
};

export const fetchNewsDetail = async (id) => {
  const response = await fetch(`${API_BASE_URL}/news/${id}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch news detail');
  }
  return await response.json();
};

export const createNews = async (newsData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/news/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newsData),
  });
  if (!response.ok) {
    throw new Error('Failed to create news');
  }
  return await response.json();
};

export const updateNews = async (id, newsData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newsData),
  });
  if (!response.ok) {
    throw new Error('Failed to update news');
  }
  return await response.json();
};

export const deleteNews = async (id) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/news/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.ok;
};