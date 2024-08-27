import React, { useEffect, useContext } from 'react';
import { Redirect } from 'expo-router';
import { LogBox } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
    const { token, refreshAccessToken } = useAuth();

    useEffect(() => {
        const checkToken = async () => {
        if (!token) {
            // 無token，跳轉至LoginScreen
            return <Redirect href="/LoginScreen" />;
        }

        try {
            // 嘗試刷新token
            await refreshAccessToken();
            // 刷新成功，跳轉至WelcomeScreen
            return <Redirect href="/WelcomeScreen" />;
        } catch (error) {
            // 刷新失敗，跳轉至LoginScreen
            return <Redirect href="/LoginScreen" />;
        }
        };

        checkToken();
    }, [token]);

    // 忽略所有警告消息
    LogBox.ignoreAllLogs(true);

    // 或者忽略特定的警告消息
    LogBox.ignoreLogs(['Warning: ...']);

  return <Redirect href="/screens/WelcomeScreen" />;
}
