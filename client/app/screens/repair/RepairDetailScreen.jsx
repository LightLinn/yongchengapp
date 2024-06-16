import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { fetchRepairDetail, updateRepair } from '../../../api/repairApi';
import { fetchVenueDetails } from '../../../api/venueApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { usePermissions } from '../../../context/PermissionsContext';

const RepairDetailScreen = () => {
  const [repair, setRepair] = useState(null);
  const [venueName, setVenueName] = useState('');
  const { repairId } = useLocalSearchParams();
  const router = useRouter();
  const { permissions, loading } = usePermissions();

  useEffect(() => {
    const loadRepairDetail = async () => {
      try {
        const fetchedRepair = await fetchRepairDetail(repairId);
        setRepair(fetchedRepair);
        const venue = await fetchVenueDetails(fetchedRepair.venue);
        setVenueName(venue.name);
      } catch (error) {
        console.error('Failed to load repair details or venue details', error);
      }
    };

    loadRepairDetail();
  }, [repairId]);

  const handleUpdate = async () => {
    try {
      await updateRepair(repairId, repair);
      alert('已更新維修資訊');
      router.back();
    } catch (error) {
      console.error('Failed to update repair', error);
    }
  };

  const hasPermission = (screenName, action) => {
    const permission = permissions.find(p => p.screen_name === screenName);
    return permission && permission[action];
  };

  if (!repair) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  const canEdit = hasPermission('repair_screen', 'can_edit');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{repair.title}</Text>
      <Input
        label="描述"
        value={repair.description}
        onChangeText={(value) => setRepair({ ...repair, description: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={canEdit}
        disabled={!canEdit}
      />
      <Input
        label="場地"
        value={venueName}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={false}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={repair.repair_status}
          onValueChange={(value) => setRepair({ ...repair, repair_status: value })}
          enabled={canEdit}
        >
          <Picker.Item label="未處理" value="未處理" />
          <Picker.Item label="處理中" value="處理中" />
          <Picker.Item label="已處理" value="已處理" />
        </Picker>
      </View>
      {canEdit && (
        <Button
          title="更新報修信息"
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
    marginBottom: 20,
    textAlign: 'left',
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
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    backgroundColor: COLORS.white,
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

export default RepairDetailScreen;
