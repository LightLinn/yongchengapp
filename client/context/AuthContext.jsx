import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_BASE_URL } from '../api/config';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupIds, setGroupIds] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadAuthInfo();
  }, []);

  const loadAuthInfo = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedGroups = await AsyncStorage.getItem('groups');
      const storedGroupIds = await AsyncStorage.getItem('group_ids');
      console.log(storedUserId)

      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
      setGroups(storedGroups ? JSON.parse(storedGroups) : []);
      setGroupIds(storedGroupIds ? JSON.parse(storedGroupIds) : []);
      setIsLogging(!!storedToken);
      console.log(storedUserId)
    } catch (error) {
      console.error('Error loading auth info:', error);
    }
  };

  const saveAuthInfo = async (data) => {
    try {
      const decodedAccessToken = jwtDecode(data.access);
      await AsyncStorage.setItem('token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);

      // await AsyncStorage.setItem('userId', data.user_id.toString());
      // await AsyncStorage.setItem('username', data.username);
      // await AsyncStorage.setItem('groups', JSON.stringify(data.groups));
      // await AsyncStorage.setItem('group_ids', JSON.stringify(data.group_ids));

      await AsyncStorage.setItem('userId', decodedAccessToken.user_id.toString());
      await AsyncStorage.setItem('username', decodedAccessToken.username);
      await AsyncStorage.setItem('groups', JSON.stringify(decodedAccessToken.groups));
      await AsyncStorage.setItem('group_ids', JSON.stringify(decodedAccessToken.group_ids));

      setToken(decodedAccessToken.access);
      setRefreshToken(decodedAccessToken.refresh);
      setUserId(decodedAccessToken.user_id.toString());
      setUsername(decodedAccessToken.username);
      setGroups(decodedAccessToken.groups);
      setGroupIds(decodedAccessToken.group_ids);
      setIsLogging(true);
    } catch (error) {
      console.error('Error saving auth info:', error);
    }
  };

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
        await saveAuthInfo(data);
      } else {
        Alert.alert('登入失敗', '使用者名稱或密碼無效');
      }
    } catch (error) {
      Alert.alert('登入失敗', '發生錯誤，請稍後再試');
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'token', 'refresh_token', 'userId', 'username', 'groups', 'group_ids', 'permissions'
      ]);
      setToken(null);
      setRefreshToken(null);
      setUserId(null);
      setUsername(null);
      setGroups([]);
      setGroupIds([]);
      setPermissions([]);
      setIsLogging(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAccessToken = async () => {
    const refresh_token = await AsyncStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });

      if (response.ok) {
        const data = await response.json();
        await saveAuthInfo(data);
        return data;
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
    <AuthContext.Provider value={{ 
      isLogging, 
      token, 
      refreshToken, 
      userId, 
      username, 
      groups, 
      groupIds, 
      permissions,
      login, 
      logout, 
      refreshAccessToken,
      setPermissions
    }}>
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
