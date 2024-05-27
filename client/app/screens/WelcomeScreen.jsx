import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';

import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const WelcomeScreen = () => {
  const router = useRouter();
  const { isLogging } = useAuth();
  const segments = useSegments();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!isLogging) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            // 模拟3秒延迟后跳转
            setTimeout(() => {
              router.replace('/(tabs)/home');
            }, 1500);
          }
        } catch (error) {
          setTimeout(() => {
            router.replace('/LoginScreen');
          }, 1500);
        }
      } else {
        // 动画淡入效果
        Animated.timing(fadeAnim, {
          toValue: 1, // 最终值为1（完全不透明）
          duration: 1000, // 动画持续时间
          useNativeDriver: true,
        }).start();

        // 模拟3秒延迟后跳转
        const timeoutId = setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);

        // 清除定时器
        return () => clearTimeout(timeoutId);
      }
    };

    checkLoginStatus();
  }, [isLogging, segments, fadeAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Image source={require('../../assets/logo-1-1.jpg')} style={styles.logo} />
      </Animated.View>
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
    width: 150,
    height: 150,
  },
});

export default WelcomeScreen;
