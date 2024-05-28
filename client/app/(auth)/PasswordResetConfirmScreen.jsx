import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '../../api/config';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const PasswordResetConfirmScreen = () => {
  const router = useRouter();
  const { uid, token } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('錯誤', '新密碼與確認新密碼不符');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/password-reset-confirm/${uid}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
        alert("成功", "密碼已重設，請重新登入");
        router.replace('/LoginScreen');
      } else {
        alert("失败", "密碼重設失败，請重試");
      }
    } catch (error) {
      alert("錯誤", "發生錯誤，請重試");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      
      <TextInput
        placeholder="新密碼"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="確認新密碼"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>重設密碼</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: COLORS.success,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',

  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default PasswordResetConfirmScreen;
