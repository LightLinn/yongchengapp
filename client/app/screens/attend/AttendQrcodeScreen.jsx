import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCheckcode } from '../../../api/attendApi';
import { COLORS, SIZES } from '../../../styles/theme';

const AttendQrcodeScreen = () => {
  const [checkcode, setCheckcode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCheckcode = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetchCheckcode(userId);
      if (response.detail) {
        setCheckcode(response.detail);
      } else {
        throw new Error('Failed to load checkcode');
      }
    } catch (error) {
      console.error('Failed to load checkcode', error);
      Alert.alert('錯誤', errorResponse.detail || '無法加載驗證碼');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckcode();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCheckcode();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>課程簽到驗證 QR Code</Text>
      {checkcode ? (
        <QRCode
          value={checkcode.toString()}
          size={200}
        />
      ) : (
        <Text style={styles.errorText}>{errorResponse.detail}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.gray3,
    marginBottom: 50,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
  },
});

export default AttendQrcodeScreen;
