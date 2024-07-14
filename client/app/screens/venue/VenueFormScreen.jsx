import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createVenue, fetchVenueDetails, updateVenue } from '../../../api/venueApi';
import { COLORS, SIZES } from '../../../styles/theme';
import LoadingSpinner from '../../components/LoadingSpinner';
import Geocoder from 'react-native-geocoding';
import moment from 'moment';
import ModalDateTimePicker from 'react-native-modal-datetime-picker';

// 初始化 Geocoder
Geocoder.init('AIzaSyCPuzFAUbHHbNUeezAdvQAFLYPOMFqzQkY'); // 在這裡使用你的 API 金鑰

const VenueFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [venue, setVenue] = useState({
    name: '',
    description: '',
    capacity: 999,
    weekday_open_time: '07:00',
    weekday_close_time: '21:30',
    holiday_open_time: '07:00',
    holiday_close_time: '21:30',
    longitude: '',
    latitude: '',
    address: '',
    managers_id: [],
  });
  const [loading, setLoading] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

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
        weekday_open_time: moment(venueDetail.weekday_open_time, 'HH:mm:ss').format('HH:mm'),
        weekday_close_time: moment(venueDetail.weekday_close_time, 'HH:mm:ss').format('HH:mm'),
        holiday_open_time: moment(venueDetail.holiday_open_time, 'HH:mm:ss').format('HH:mm'),
        holiday_close_time: moment(venueDetail.holiday_close_time, 'HH:mm:ss').format('HH:mm'),
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

  const validateForm = () => {
    const { name, description, address, weekday_open_time, weekday_close_time, holiday_open_time, holiday_close_time } = venue;

    if (!name || !description || !address || !weekday_open_time || !weekday_close_time || !holiday_open_time || !holiday_close_time) {
      Alert.alert('錯誤', '請填寫所有欄位');
      return false;
    }

    const timeFormat = /^\d{2}:\d{2}$/;
    if (!timeFormat.test(weekday_open_time) || !timeFormat.test(weekday_close_time) || !timeFormat.test(holiday_open_time) || !timeFormat.test(holiday_close_time)) {
      Alert.alert('錯誤', '時間格式應為 HH:MM');
      return false;
    }

    return true;
  };

  const handleAddressChange = async (address) => {
    const updatedVenue = { ...venue, address };
    setVenue(updatedVenue);
    try {
      const json = await Geocoder.from(address);
      const location = json.results[0].geometry.location;
      setVenue((prevVenue) => ({
        ...prevVenue,
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
      }));
    } catch (error) {
      console.warn('地址轉換失敗', error);
    }
  };

  const showTimePicker = (field) => {
    setCurrentField(field);
    setTimePickerVisible(true);
  };

  const handleConfirm = (selectedTime) => {
    const formattedTime = moment(selectedTime).format('HH:mm');
    setVenue({ ...venue, [currentField]: formattedTime });
    setTimePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (id) {
        await updateVenue(id, venue);
      } else {
        await createVenue(venue);
      }
      Alert.alert('成功', '場地保存成功');
      router.back();
    } catch (error) {
      console.error('Failed to save venue', error);
      Alert.alert('錯誤', '保存失敗');
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
        keyboardType="numeric"
      />
      <Input
        label="平日開放時間"
        value={venue.weekday_open_time}
        onFocus={() => showTimePicker('weekday_open_time')}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="平日關閉時間"
        value={venue.weekday_close_time}
        onFocus={() => showTimePicker('weekday_close_time')}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="假日開放時間"
        value={venue.holiday_open_time}
        onFocus={() => showTimePicker('holiday_open_time')}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="假日關閉時間"
        value={venue.holiday_close_time}
        onFocus={() => showTimePicker('holiday_close_time')}
        inputStyle={styles.input}
        labelStyle={styles.label}
        placeholder="HH:MM"
      />
      <Input
        label="地址"
        value={venue.address}
        onChangeText={handleAddressChange}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="經度"
        value={venue.longitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, longitude: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
        editable={false}
      />
      <Input
        label="緯度"
        value={venue.latitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, latitude: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
        editable={false}
      />
      <Button
        title="儲存場地"
        onPress={handleSubmit}
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
      />
      <ModalDateTimePicker
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setTimePickerVisible(false)}
        is24Hour={true}
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
