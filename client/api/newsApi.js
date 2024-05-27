import { API_BASE_URL } from './config'; // 确保路径正确

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
