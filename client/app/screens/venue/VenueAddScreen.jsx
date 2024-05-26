import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { createVenue } from '../../../api/venueApi'; // 假设从单独的 API 文件中导入

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
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        label="名稱"
        value={venue.name}
        onChangeText={(value) => setVenue({ ...venue, name: value })}
      />
      <Input
        label="描述"
        value={venue.description}
        onChangeText={(value) => setVenue({ ...venue, description: value })}
      />
      <Input
        label="人數容量"
        value={venue.capacity}
        onChangeText={(value) => setVenue({ ...venue, capacity: value })}
      />
      <Input
        label="平日開放時間"
        value={venue.weekday_open}
        onChangeText={(value) => setVenue({ ...venue, weekday_open: value })}
      />
      <Input
        label="平日關閉時間"
        value={venue.weekday_close}
        onChangeText={(value) => setVenue({ ...venue, weekday_close: value })}
      />
      <Input
        label="假日開放時間"
        value={venue.weekend_open}
        onChangeText={(value) => setVenue({ ...venue, weekend_open: value })}
      />
      <Input
        label="假日關閉時間"
        value={venue.weekend_close}
        onChangeText={(value) => setVenue({ ...venue, weekend_close: value })}
      />
      <Input
        label="經度"
        value={venue.longitude}
        onChangeText={(value) => setVenue({ ...venue, longitude: value })}
      />
      <Input
        label="緯度"
        value={venue.latitude}
        onChangeText={(value) => setVenue({ ...venue, latitude: value })}
      />
      <Input
        label="地址"
        value={venue.address}
        onChangeText={(value) => setVenue({ ...venue, address: value })}
      />
      <Input
        label="管理者"
        value={venue.manager}
        onChangeText={(value) => setVenue({ ...venue, manager: value })}
      />
      <Button title="新增場地" onPress={handleCreate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default AddVenueScreen;
