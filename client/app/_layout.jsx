import React from 'react';
import { Stack } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from '../context/AuthContext'

export default function Layout() {
  const router = useRouter();

  const navigateToAvatar = () => {
    router.push('/screens/ProfileScreen'); 
  };

  const navigateToNotify = () => {
    router.push('/screens/notify/NotifyScreen'); 
  };

  return (
    <AuthProvider>
    <Stack>
      <Stack.Screen 
        name="index"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="(tabs)"
        options={{ 
          headerShadowVisible: false,
          headerTitle: '',
          headerRight: () => (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={navigateToNotify}>
                <Icon name="notifications" type="material" color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToAvatar} style={styles.avatarIcon}>
                <Icon name="account-circle" type="material" color="#333" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <Image 
              source={require('../assets/logo-02.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          ),
        }} 
      />
      <Stack.Screen 
        name="(auth)"
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="screens"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }}
      />
    </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarIcon: {
    marginLeft: 15,
  },
  logo: {
    width: 100,
    height: 40,
  },
});
