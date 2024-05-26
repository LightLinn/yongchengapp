import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState(['admin']);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedGroups = await AsyncStorage.getItem('groups');
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setIsLogging(!!storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
      setGroups(JSON.parse(storedGroups));
    };
    loadToken();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.access);
        await AsyncStorage.setItem('refresh_token', data.refresh);
        await AsyncStorage.setItem('userId', data.user_id.toString());
        await AsyncStorage.setItem('username', data.username);
        await AsyncStorage.setItem('groups', JSON.stringify(data.groups));
        setToken(data.access);
        setRefreshToken(data.refresh);
        setIsLogging(true);
        setUserId(data.user_id);
        setUsername(data.username);
        setGroups(data.groups);
      } else {
        Alert.alert('登入失敗', '使用者名稱或密碼無效');
      }
    } catch (error) {
      Alert.alert('登入失敗', '發生錯誤，請稍後再試');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('groups');
    setToken(null);
    setRefreshToken(null);
    setIsLogging(false);
    setUserId(null);
    setUsername(null);
    setGroups([]);

  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.access);
        setToken(data.access);
        return data.access;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Token refresh failed', error);
      await logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLogging, token, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
