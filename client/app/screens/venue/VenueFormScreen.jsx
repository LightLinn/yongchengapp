import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createVenue, fetchVenueDetails, updateVenue } from '../../../api/venueApi';
import { COLORS, SIZES } from '../../../styles/theme';
import LoadingSpinner from '../../components/LoadingSpinner';

const VenueFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [venue, setVenue] = useState({
    name: '',
    description: '',
    capacity: '',
    weekday_open_time: '',
    weekday_close_time: '',
    holiday_open_time: '',
    holiday_close_time: '',
    longitude: '',
    latitude: '',
    address: '',
    managers_id: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadVenueDetail();
    }
  }, [id]);

  const loadVenueDetail = async () => {
    setLoading(true);
    try {
      const venueDetail = await fetchVenueDetails(id);
      setVenue({
        name: venueDetail.name,
        description: venueDetail.description,
        capacity: venueDetail.capacity,
        weekday_open_time: venueDetail.weekday_open_time,
        weekday_close_time: venueDetail.weekday_close_time,
        holiday_open_time: venueDetail.holiday_open_time,
        holiday_close_time: venueDetail.holiday_close_time,
        longitude: venueDetail.longitude,
        latitude: venueDetail.latitude,
        address: venueDetail.address,
        managers_id: venueDetail.managers.map(manager => manager.id),
      });
    } catch (error) {
      console.error('Failed to load venue detail', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (id) {
        await updateVenue(id, venue);
      } else {
        await createVenue(venue);
      }
      alert('場地保存成功');
      router.back();
    } catch (error) {
      console.error('Failed to save venue', error);
      alert('保存失敗');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        label="場地名稱"
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
        multiline
      />
      <Input
        label="容量"
        value={venue.capacity.toString()}
        onChangeText={(value) => setVenue({ ...venue, capacity: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        // keyboardType="numeric"
      />
      <Input
        label="平日開放時間"
        value={venue.weekday_open_time}
        onChangeText={(value) => setVenue({ ...venue, weekday_open_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="平日關閉時間"
        value={venue.weekday_close_time}
        onChangeText={(value) => setVenue({ ...venue, weekday_close_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="假日開放時間"
        value={venue.holiday_open_time}
        onChangeText={(value) => setVenue({ ...venue, holiday_open_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="假日關閉時間"
        value={venue.holiday_close_time}
        onChangeText={(value) => setVenue({ ...venue, holiday_close_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="經度"
        value={venue.longitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, longitude: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
      />
      <Input
        label="緯度"
        value={venue.latitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, latitude: value })}
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
      <Button
        title="儲存場地"
        onPress={handleSubmit}
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
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
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default VenueFormScreen;
