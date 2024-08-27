import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppInitializer = () => {
  const router = useRouter();
  const { isLogging, token, refreshAccessToken } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');

        if (!storedToken) {
          router.replace('/LoginScreen');
          return;
        }

        // Token exists, check if it's valid
        try {
          await refreshAccessToken();
          router.replace('/screens/WelcomeScreen');
        } catch (error) {
          // If refresh fails, redirect to login
          console.error('Token refresh failed:', error);
          router.replace('/LoginScreen');
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        router.replace('/LoginScreen');
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AppInitializer;