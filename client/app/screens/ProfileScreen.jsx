import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from '../../api/profileApi';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, FONT } from '../../styles/theme';
import moment from 'moment';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    avatar: '',
    username: '',
    groups: [],
    email: '',
    phone: '',
    nickname: '',
    address: '',
    birthday: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const { logout } = useAuth();

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!validateEmail(profile.email)) {
      Alert.alert('無效的Email', '請輸入有效的電子郵件地址。');
      return;
    }

    if (!validatePhone(profile.phone)) {
      Alert.alert('無效的手機號碼', '請輸入有效的手機號碼，必須為10位數字。');
      return;
    }

    try {
      await updateUserProfile(profile);
      Alert.alert('成功', '個人檔案已更新。');
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('失敗', '個人檔案更新失敗，請稍後再試一次。');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/LoginScreen');
  };

  const handleChangePassword = () => {
    router.push('/ChangePasswordScreen');
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      '刪除帳號',
      '您確定要刪除帳號嗎？這個操作無法撤銷。',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              const token = await AsyncStorage.getItem('token');
              await deleteUserAccount(userId, token);
              await logout();
              router.replace('/LoginScreen');
            } catch (error) {
              console.error('Failed to delete account', error);
              Alert.alert('失敗', '帳號刪除失敗，請稍後再試一次。');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profile.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.groups}>{profile.groups.join(', ')}</Text>
      </View>
      <View style={styles.detailsSection}>
        <Text style={styles.label}>名稱</Text>
        <TextInput
          style={styles.input}
          value={profile.nickname}
          onChangeText={(value) => handleChange('nickname', value)}
        />
        <Text style={styles.label}>電子信箱</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(value) => handleChange('email', value)}
        />
        <Text style={styles.label}>行動電話</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(value) => handleChange('phone', value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>住址</Text>
        <TextInput
          style={styles.input}
          value={profile.address}
          onChangeText={(value) => handleChange('address', value)}
        />
        <Text style={styles.label}>生日</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={profile.birthday ? moment(profile.birthday).format('YYYY-MM-DD') : ''}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            handleChange('birthday', date.toISOString().split('T')[0]);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
        <Button title="更新" onPress={handleSubmit} buttonStyle={styles.submitButton} />
        <Button title="變更密碼" onPress={handleChangePassword} buttonStyle={styles.changePasswordButton} />
        <Button title="登出" onPress={handleLogout} buttonStyle={styles.logoutButton} />
        <Button title="刪除帳號" onPress={handleDeleteAccount} buttonStyle={styles.deleteAccountButton} />
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
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
  deleteAccountButton: {
    marginTop: 20,
    backgroundColor: COLORS.danger,
    borderRadius: 20,
  },
});

export default ProfileScreen;
