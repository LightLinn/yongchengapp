import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const router = useRouter();
  const { isLogging } = useAuth();
  const fadeAnimLogo1 = useRef(new Animated.Value(0)).current;
  const fadeAnimLogo2 = useRef(new Animated.Value(0)).current;
  const fadeAnimLogo3 = useRef(new Animated.Value(0)).current;
  const seconds = 1000;

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');

      // Chain animations
      Animated.sequence([
        Animated.timing(fadeAnimLogo1, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.stagger(0, [
          Animated.timing(fadeAnimLogo2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnimLogo3, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      if (token) {
        try {
          setTimeout(() => {
            router.replace('/(tabs)/home');
          }, seconds + 2000); // 延遲以讓動畫播放完畢
        } catch (error) {
          console.log('Token refresh failed', error);
          setTimeout(() => {
            router.replace('/LoginScreen');
          }, seconds + 2000); // 延遲以讓動畫播放完畢
        }
      } else {
        const timeoutId = setTimeout(() => {
          router.replace('/LoginScreen');
        }, seconds + 2000); // 延遲以讓動畫播放完畢
        return () => clearTimeout(timeoutId);
      }
    };

    checkLoginStatus();
  }, [isLogging]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnimLogo1 }}>
        <Image source={require('../../assets/logo-1-5.png')} style={styles.logo} />
      </Animated.View>
      <View style={styles.extraLogosContainer}>
        <Animated.View style={{ ...styles.extraLogoContainer, opacity: fadeAnimLogo2 }}>
          <Image source={require('../../assets/logo-2-1.png')} style={styles.extraLogo} />
        </Animated.View>
        <Animated.View style={{ ...styles.extraLogoContainer, opacity: fadeAnimLogo3 }}>
          <Image source={require('../../assets/logo-3-1.png')} style={styles.extraLogo} />
        </Animated.View>
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
  extraLogoContainer: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
  extraLogo: {
    width: 100,
    height: 100,
  },
});

export default WelcomeScreen;
