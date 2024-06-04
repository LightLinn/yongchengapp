// src/screens/repair/RepairDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchRepairDetail, updateRepair } from '../../../api/repairApi';
import { fetchVenueDetails } from '../../../api/venueApi';
import { fetchUserPermissions } from '../../../api/groupApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useAuth } from '../../../context/AuthContext';

const RepairDetailScreen = () => {
  const [repair, setRepair] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const { repairId } = useLocalSearchParams();
  const router = useRouter();
  const { groupIds } = useAuth();

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

    loadRepairDetail();
  }, [repairId, groupIds]);

  const handleUpdate = async () => {
    try {
      await updateRepair(repairId, repair);
      alert('已更新維修資訊');
      router.back();
    } catch (error) {
      console.error('Failed to update repair', error);
    }
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name.screen_name === 'repair_screen');
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

  const canEdit = hasPermission('can_edit');

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
        label="狀態"
        value={repair.repair_status}
        onChangeText={(value) => setRepair({ ...repair, repair_status: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={false}
        disabled={!canEdit}
      />
      <Input
        label="場地"
        value={venueName}
        inputStyle={styles.input}
        labelStyle={styles.label}
        editable={false}
      />
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
