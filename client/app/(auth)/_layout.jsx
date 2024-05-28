import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="LoginScreen"
        options={{ 
          headerTitle: '登入',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="ChangePasswordScreen"
        options={{ 
          headerTitle: '變更密碼',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="ForgotPasswordScreen"
        options={{ 
          headerTitle: '忘記密碼',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="RegisterScreen"
        options={{ 
          headerTitle: '註冊',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="PasswordResetConfirmScreen"
        options={{ 
          headerTitle: '密碼重設確認',
          headerShadowVisible: false,
        }} 
      />

    </Stack>
  )
}

export default AuthLayout