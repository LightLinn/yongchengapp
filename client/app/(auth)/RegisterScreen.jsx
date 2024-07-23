import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../api/config';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("密碼不相符，請再次輸入");
      return;
    }

    

    if (!/^[a-zA-Z0-9]{6,}$/.test(username)) {
      alert("使用者名稱必須是英數組合且超過6位數");
      return;
    }

    if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password)) {
      alert("密碼必須是英數組合且超過8位數");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("註冊成功");
        router.back();
      } else {
        const errorData = await response.json();
        console.log(errorData);
        if (errorData !== '') {
          alert(`註冊失敗: ${errorData}`);
        } else {
          alert("註冊失敗");
        }
        // alert(`註冊失敗: ${errorData}`);
      }
    } catch (error) {
      alert("發生錯誤，請稍後再試");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text h3 style={styles.title}>註冊</Text> */}
      <Text style={styles.label}>使用者名稱</Text>
      <Input
        placeholder="6位數以上英文數字組合"
        value={username}
        onChangeText={setUsername}
        containerStyle={styles.inputContainer}
        inputStyle={{ fontSize: SIZES.small }}
      />
      <Text style={styles.label}>電子信箱</Text>
      <Input
        placeholder=""
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
        inputStyle={{ fontSize: SIZES.small }}
      />
      <Text style={styles.label}>密碼</Text>
      <Input
        placeholder="8位數以上英文數字組合"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
        inputStyle={{ fontSize: SIZES.small }}
      />
      <Text style={styles.label}>確認密碼</Text>
      <Input
        placeholder="8位數以上英文數字組合"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
        inputStyle={{ fontSize: SIZES.small }}
      />
      <Button
        title="註冊"
        buttonStyle={styles.button}
        onPress={handleRegister}
      />
      <Text style={styles.loginText}>
        已經有帳號？ <Text style={styles.loginLink} onPress={() => router.back()}>登入</Text>
      </Text>
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
  label: {
    fontSize: SIZES.large,
    marginBottom: 5,
    color: COLORS.gray,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.success,
    borderRadius: 20,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  loginLink: {
    color: COLORS.primary,
  },
});

export default RegisterScreen;
