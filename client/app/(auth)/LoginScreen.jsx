import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.replace('/(tabs)/home');
      Alert.alert('登入成功', '');
    } catch (error) {
      Alert.alert('登入失敗', '使用者名稱或密碼無效');
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
        placeholder="密碼"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.inputContainer}
      />
      <Button
        title="登入"
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={handleLogin}
      />
      <Button
        title="註冊"
        type="outline"
        buttonStyle={styles.linkButton}
        titleStyle={styles.linkButtonText}
        onPress={() => router.push('/RegisterScreen')}
      />
      <Button
        title="忘記密碼"
        type="outline"
        buttonStyle={styles.linkButton}
        titleStyle={styles.linkButtonText}
        onPress={() => router.push('/ForgotPasswordScreen')}
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
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  linkButton: {
    marginTop: 10,
    borderRadius: 20,
    borderColor: COLORS.primary,
  },
  linkButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
});

export default LoginScreen;
