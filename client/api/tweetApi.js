import { API_BASE_URL } from './config'; // 确保路径正确

export const fetchTweets = async () => {
  const response = await fetch(`${API_BASE_URL}/tweets/`);
  return await response.json();
};

export const postTweet = async (tweet) => {
  const response = await fetch(`${API_BASE_URL}/tweets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweet),
  });
  return await response.json();
};
