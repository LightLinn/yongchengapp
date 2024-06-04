import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { createVenue } from '../../../api/venueApi'; // 假設從單獨的 API 文件中導入
import { COLORS, SIZES, FONT } from '../../../styles/theme';

const AddVenueScreen = () => {
  const [venue, setVenue] = useState({
    name: '',
    description: '',
    capacity: '',
    weekday_open: '',
    weekday_close: '',
    weekend_open: '',
    weekend_close: '',
    longitude: '',
    latitude: '',
    address: '',
    manager: '',
  });

  const router = useRouter();

  const handleCreate = async () => {
    try {
      await createVenue(venue);
      alert('場地已新增');
      router.back();
    } catch (error) {
      console.error('Failed to create venue', error);
      console.log(venue);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        label="名稱"
        value={venue.name}
        onChangeText={(value) => setVenue({ ...venue, name: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="描述"
        value={venue.description}
        onChangeText={(value) => setVenue({ ...venue, description: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="人數容量"
        value={venue.capacity}
        onChangeText={(value) => setVenue({ ...venue, capacity: parseInt(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
      />
      <Input
        label="平日開放時間"
        value={venue.weekday_open}
        onChangeText={(value) => setVenue({ ...venue, weekday_open: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="平日關閉時間"
        value={venue.weekday_close}
        onChangeText={(value) => setVenue({ ...venue, weekday_close: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="假日開放時間"
        value={venue.weekend_open}
        onChangeText={(value) => setVenue({ ...venue, weekend_open: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="假日關閉時間"
        value={venue.weekend_close}
        onChangeText={(value) => setVenue({ ...venue, weekend_close: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="經度"
        value={venue.longitude}
        onChangeText={(value) => setVenue({ ...venue, longitude: parseInt(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
      />
      <Input
        label="緯度"
        value={venue.latitude}
        onChangeText={(value) => setVenue({ ...venue, latitude: parseInt(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
      />
      <Input
        label="地址"
        value={venue.address}
        onChangeText={(value) => setVenue({ ...venue, address: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="管理者"
        value={venue.manager}
        onChangeText={(value) => setVenue({ ...venue, manager: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}ㄇ
      />
      <Button
        title="新增場地"
        onPress={handleCreate}
        buttonStyle={styles.createButton}
        titleStyle={styles.createButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  title: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  label: {
    color: COLORS.tertiary,
    fontSize: SIZES.medium,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  createButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default AddVenueScreen;
