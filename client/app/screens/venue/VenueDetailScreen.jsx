import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchVenueDetails, updateVenue } from '../../../api/venueApi';
import { fetchUserPermissions } from '../../../api/groupApi';
import { COLORS, SIZES, FONT } from '../../../styles/theme';
import { useAuth } from '../../../context/AuthContext';

const VenueDetailScreen = () => {
  const [venue, setVenue] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const { venueId } = useLocalSearchParams();
  const router = useRouter();
  const { groupIds } = useAuth();

  useEffect(() => {
    const loadVenueDetails = async () => {
      try {
        const fetchedVenue = await fetchVenueDetails(venueId);
        setVenue(fetchedVenue);
        console.log('fetchedVenue', fetchedVenue);
      } catch (error) {
        console.error('Failed to load venue details', error);
      }
    };

    const loadPermissions = async () => {
      try {
        const userPermissions = await fetchUserPermissions(groupIds);
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Failed to load permissions', error);
      }
    };

    if (groupIds && groupIds.length > 0) {
      loadPermissions();
    }

    loadVenueDetails();
  }, [venueId, groupIds]);

  const handleUpdate = async () => {
    try {
      await updateVenue(venueId, venue);
      alert('場地信息已更新');
      router.back();
    } catch (error) {
      console.error('Failed to update venue', error);
    }
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name.screen_name === 'venue_screen');
    return permission && permission[action];
  };

  if (!venue) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  const canEdit = hasPermission('can_edit');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{venue.name}</Text>
      <Input
        label="名稱"
        value={venue.name}
        onChangeText={(value) => setVenue({ ...venue, name: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="描述"
        value={venue.description}
        onChangeText={(value) => setVenue({ ...venue, description: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="人數容量"
        value={venue.capacity.toString()}
        onChangeText={(value) => setVenue({ ...venue, capacity: parseInt(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
        editable={canEdit}
      />
      <Input
        label="平日開放時間"
        value={venue.weekday_open_time}
        onChangeText={(value) => setVenue({ ...venue, weekday_open_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="平日關閉時間"
        value={venue.weekday_close_time}
        onChangeText={(value) => setVenue({ ...venue, weekday_close_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="假日開放時間"
        value={venue.holiday_open_time}
        onChangeText={(value) => setVenue({ ...venue, holiday_open_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="假日關閉時間"
        value={venue.holiday_close_time}
        onChangeText={(value) => setVenue({ ...venue, holiday_close_time: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Input
        label="經度"
        value={venue.longitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, longitude: parseFloat(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
        editable={canEdit}
      />
      <Input
        label="緯度"
        value={venue.latitude.toString()}
        onChangeText={(value) => setVenue({ ...venue, latitude: parseFloat(value) })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        keyboardType="numeric"
        editable={canEdit}
      />
      <Input
        label="地址"
        value={venue.address}
        onChangeText={(value) => setVenue({ ...venue, address: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
      />
      <Text style={styles.managerTitle}>管理者</Text>
      {venue.managers.map((manager) => (
        <View key={manager.id} style={styles.managerContainer}>
          <Text style={styles.managerText}>{manager.username}</Text>
        </View>
      ))}
      {canEdit && (
        <Button
          title="更新場地信息"
          onPress={handleUpdate}
          buttonStyle={styles.updateButton}
          titleStyle={styles.updateButtonText}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  title: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'left',
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
  managerTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    padding: 10,
    
  },
  managerContainer: {
    paddingLeft: 10,
  },
  managerText: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  updateButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default VenueDetailScreen;
