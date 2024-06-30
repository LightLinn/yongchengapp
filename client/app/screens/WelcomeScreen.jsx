import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const router = useRouter();
  const { isLogging, refreshAccessToken } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const seconds = 1000;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          setTimeout(() => {
            router.replace('/(tabs)/home');
          }, seconds);
          
        } catch (error) {
          console.log('Token refresh failed', error);
          setTimeout(() => {
            router.replace('/LoginScreen');
          }, seconds);
        }
      } else {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        const timeoutId = setTimeout(() => {
          router.replace('/LoginScreen');
        }, seconds);
        return () => clearTimeout(timeoutId);
      }
    };

    checkLoginStatus();
  }, [isLogging]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Image source={require('../../assets/logo-1-5.png')} style={styles.logo} />
      </Animated.View>
      <View style={styles.extraLogosContainer}>
        <Image source={require('../../assets/logo-2-1.png')} style={styles.extraLogo} />
        <Image source={require('../../assets/logo-3-1.png')} style={styles.extraLogo} />
      </View>
      <ActivityIndicator size="large" color="#999" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 250,
  },
  extraLogosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
    marginBottom: 50,
  },
  extraLogo: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
});

export default WelcomeScreen;
