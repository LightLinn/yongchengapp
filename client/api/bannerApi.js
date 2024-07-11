import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const fetchBannerImages = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/banner/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    // 確保數據按 order 排序
    return data.sort((a, b) => a.order - b.order);
  } else {
    throw new Error('Failed to fetch banners');
  }
};