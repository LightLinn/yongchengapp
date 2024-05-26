import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../api/config';

const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.uid);
        router.push({
          pathname: '/PasswordResetConfirmScreen',
          params: { uid: data.uid, token: data.token }
        });
      } else {
        const errorData = await response.json();
        console.log(errorData);
        if (errorData.non_field_errors) {
          alert(`重設失敗: ${errorData.non_field_errors[0]}`);
        } else if (errorData.email) {
          alert(`重設失敗: ${errorData.email[0]}`);
        } else {
          alert("重設失敗");
        }
      }
    } catch (error) {
      alert("發生錯誤，請重試");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="使用者名稱"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        containerStyle={styles.inputContainer}
      />
      <Input
        placeholder="電子信箱"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
      />
      <Button
        title="重設密碼"
        buttonStyle={styles.button}
        onPress={handleResetPassword}
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

export default ForgotPasswordScreen;
