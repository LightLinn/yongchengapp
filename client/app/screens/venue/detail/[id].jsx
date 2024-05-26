import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useRouter, useRoute } from 'expo-router';
import { fetchVenueDetails, updateVenue } from '../../../../api/venueApi'; // 假设从单独的 API 文件中导入

const VenueDetailScreen = () => {
  const [venue, setVenue] = useState(null);
  const router = useRouter();
  const { id } = useRoute().params;

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const fetchedVenue = await fetchVenueDetails(id);
        setVenue(fetchedVenue);
      } catch (error) {
        console.error('Failed to load venue details', error);
      }
    };

    loadVenueDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateVenue(id, venue);
      alert('場地信息已更新');
      router.back();
    } catch (error) {
      console.error('Failed to update venue', error);
    }
  };

  if (!venue) {
    return <Text>Loading...</Text>;
  }

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
        value={venue.capacity.toString()}
        onChangeText={(value) => setVenue({ ...venue, capacity: parseInt(value) })}
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
        value={venue.longitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, longitude: parseFloat(value) })}
      />
      <Input
        label="緯度"
        value={venue.latitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, latitude: parseFloat(value) })}
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
      <Button title="更新場地信息" onPress={handleUpdate} />
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

export default VenueDetailScreen;
