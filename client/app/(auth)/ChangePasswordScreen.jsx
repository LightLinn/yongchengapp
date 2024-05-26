import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();
  
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('新密碼與確認新密碼不符');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/password-change/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      if (response.ok) {
        alert("密碼修改成功");
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('groups');
        router.replace('/LoginScreen'); // 跳转到登录页面
      } else {
        alert("密碼修改失敗，請重試");
      }
    } catch (error) {
      alert("發生錯誤，請重試");
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Input
        placeholder="舊密碼"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      <Input
        placeholder="新密碼"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      <Input
        placeholder="確認新密碼"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      <Button
        title="修改密碼"
        buttonStyle={styles.button}
        onPress={handleChangePassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2089dc',
    borderRadius: 20,
  },
});

export default ChangePasswordScreen;
