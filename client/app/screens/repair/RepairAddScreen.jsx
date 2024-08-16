import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { createRepair } from '../../../api/repairApi';
import { fetchVenues } from '../../../api/venueApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useAuth } from '../../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { usePermissions } from '../../../context/PermissionsContext';

const RepairAddScreen = () => {
  const [repair, setRepair] = useState({
    title: '',
    description: '',
    repair_status: '未處理',
    venue: null,
    user: '',
  });
  const [venues, setVenues] = useState([]);
  const router = useRouter();
  const { userId } = useAuth();
  const { permissions, loading } = usePermissions();

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const fetchedVenues = await fetchVenues();
        setVenues(fetchedVenues);
      } catch (error) {
        console.error('Failed to load venues', error);
      }
    };

    loadVenues();
  }, []);

  useEffect(() => {
    if (userId) {
      setRepair((prevRepair) => ({ ...prevRepair, user: userId }));
    }
  }, [userId]);

  const handleCreate = async () => {
    try {
      await createRepair({
        title: repair.title,
        description: repair.description,
        repair_status: '未處理',
        venue: repair.venue,
        user: userId,
      });
      alert('已送出維修申請');
      router.back();
    } catch (error) {
      console.error('Failed to create repair', error);
    }
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name === '維修列表');
    return permission && permission[action];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!hasPermission('can_create')) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text>你沒有創建報修申請的權限</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        label="標題"
        value={repair.title}
        onChangeText={(value) => setRepair({ ...repair, title: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
      />
      <Input
        label="描述"
        value={repair.description}
        onChangeText={(value) => setRepair({ ...repair, description: value })}
        inputStyle={styles.input}
        labelStyle={styles.label}
        multiline
      />
      <Picker
        selectedValue={repair.venue}
        onValueChange={(value) => setRepair({ ...repair, venue: value })}
      >
        <Picker.Item label="請選擇" value={null} />
        {venues.map((venue) => (
          <Picker.Item key={venue.id} label={venue.name} value={venue.id} />
        ))}
      </Picker>
      <Button
        title="創建報修申請"
        onPress={handleCreate}
        buttonStyle={styles.createButton}
        titleStyle={styles.createButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 50,
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
  permissionDeniedContainer: {
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
});

export default RepairAddScreen;
