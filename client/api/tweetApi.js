import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

const getUserId = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return userId;
};

export const fetchTweets = async () => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/tweets/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.map(tweet => ({
    ...tweet,
    likes: tweet.likes || 0,
    comments_count: tweet.comments_count || 0
  }));
};

export const postTweet = async (tweet) => {
  const token = await getToken();
  const userId = await getUserId();
  const response = await fetch(`${API_BASE_URL}/tweets/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ ...tweet, user: userId }),
  });
  return await response.json();
};

export const postTweetLike = async (tweetId) => {
  const token = await getToken();
  await fetch(`${API_BASE_URL}/tweet-likes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ tweet: tweetId, user: userId }),
  });
};

export const fetchTweetComments = async (tweetId) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/tweets-comments/?tweet=${tweetId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const postCommentLike = async (commentId) => {
  const token = await getToken();
  await fetch(`${API_BASE_URL}/tweet-comment-likes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ comment: commentId }),
  });
};
