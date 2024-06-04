import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import EditableProfileItem from '../components/EditableProfileItem';
import { fetchUserProfile, updateUserProfile } from '../../api/profileApi';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    avatar: '',
    username: '',
    groups: [],
    email: '',
    phone: '',
    nickname: '',
    address: '',
    sex: '',
    birthday: '',
  });
  const router = useRouter();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (userId && token) {
          const profileData = await fetchUserProfile(userId, token);
          setProfile({
            avatar: profileData.avatar,
            username: profileData.username,
            groups: profileData.groups || [],
            email: profileData.email,
            phone: profileData.phone,
            nickname: profileData.nickname,
            address: profileData.address,
            // sex: profileData.sex,
            birthday: profileData.birthday,
          });
        } else {
          console.error('User ID or Token not found in storage');
        }
      } catch (error) {
        console.error('Failed to load user profile', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateUserProfile(profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('groups');
    router.replace('/LoginScreen');
  };

  const handleChangePassword = () => {
    router.push('/ChangePasswordScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profile.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.groups}>{profile.groups.join(', ')}</Text>
      </View>
      <View style={styles.detailsSection}>
        <EditableProfileItem
          label="Nickname"
          value={profile.nickname}
          onChange={(value) => handleChange('nickname', value)}
        />
        <EditableProfileItem
          label="Email"
          value={profile.email}
          onChange={(value) => handleChange('email', value)}
        />
        <EditableProfileItem
          label="Phone"
          value={profile.phone}
          onChange={(value) => handleChange('phone', value)}
        />
        <EditableProfileItem
          label="Address"
          value={profile.address}
          onChange={(value) => handleChange('address', value)}
        />
        {/* <EditableProfileItem
          label="Sex"
          value={profile.sex}
          onChange={(value) => handleChange('sex', value)}
        /> */}
        <EditableProfileItem
          label="Birthday"
          value={profile.birthday}
          onChange={(value) => handleChange('birthday', value)}
        />
        <Button title="更新" onPress={handleSubmit} buttonStyle={styles.submitButton} />
        <Button title="變更密碼" onPress={handleChangePassword} buttonStyle={styles.changePasswordButton} />
        <Button title="登出" onPress={handleLogout} buttonStyle={styles.logoutButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  groups: {
    fontSize: 16,
    color: 'gray',
  },
  detailsSection: {
    marginTop: 20,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: COLORS.success,
  },
  changePasswordButton: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
  },
});

export default ProfileScreen;
