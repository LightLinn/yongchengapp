import React, { useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const router = useRouter();
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        try {
          await refreshAccessToken();
          router.replace('/(tabs)/home');
        } catch (error) {
          console.log('Token refresh failed', error);
          router.replace('/LoginScreen');
        }
      } else {
        router.replace('/LoginScreen');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo-1-5.png')} style={styles.logo} />
      </View>
      <View style={styles.extraLogosContainer}>
        <View style={styles.extraLogoContainer}>
          <Image source={require('../../assets/logo-2-1.png')} style={styles.extraLogo} />
        </View>
        <View style={styles.extraLogoContainer}>
          <Image source={require('../../assets/logo-3-1.png')} style={styles.extraLogo} />
        </View>
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
    resizeMode: 'contain',
  },
  extraLogosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
    marginBottom: 50,
  },
  extraLogoContainer: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
  extraLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default WelcomeScreen;
