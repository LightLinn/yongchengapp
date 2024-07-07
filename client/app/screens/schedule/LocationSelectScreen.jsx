import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchLocations, createLocation, deleteLocation } from '../../../api/locationApi';
import { usePermissions } from '../../../context/PermissionsContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const LocationSelectScreen = () => {
  const [locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [loading, setLoading] = useState(true);
  const { permissions, loading: permissionsLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (error) {
      console.error('Failed to load locations', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (location) => {
    router.push(`/screens/schedule/CoachAvailableslotsScreen?locationId=${location.id}&locationName=${location.name}`);
  };

  const handleAddLocation = async () => {
    if (!newLocationName) {
      Alert.alert('場地名稱不能為空');
      return;
    }
    try {
      const newLocation = await createLocation({ name: newLocationName });
      setLocations([...locations, newLocation]);
      setNewLocationName('');
    } catch (error) {
      console.error('Failed to create location', error);
      Alert.alert('新增場地失敗');
    }
  };

  const handleDeleteLocation = async (id) => {
    Alert.alert('確定要刪除場地嗎？', '', [
      { text: '取消', style: 'cancel' },
      { text: '確定', onPress: () => deleteLocationHandler(id) },
    ]);
  };

  const deleteLocationHandler = async (id) => {
    try {
      const response = await deleteLocation(id);
      if (response.ok) {
        setLocations(locations.filter(location => location.id !== id));
      } else {
        console.error('Failed to delete location', response);
        Alert.alert('刪除場地失敗');
      }
    } catch (error) {
      console.error('Failed to delete location', error);
      Alert.alert('刪除場地失敗');
    }
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name === '場地管理');
    return permission && permission[action];
  };

  if (loading || permissionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.locationItemContainer}>
            <TouchableOpacity style={styles.locationItem} onPress={() => handleSelect(item)}>
              <Text style={styles.locationText}>{item.name}</Text>
            </TouchableOpacity>
            {/* {hasPermission('can_delete') && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteLocation(item.id)}>
                <Text style={styles.deleteButtonText}>刪除</Text>
              </TouchableOpacity>
            )} */}
          </View>
        )}
      />
      {hasPermission('can_create') && (
        <View style={styles.addContainer}>
          <TextInput
            style={styles.input}
            placeholder="新增場地名稱"
            value={newLocationName}
            onChangeText={setNewLocationName}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
            <Text style={styles.addButtonText}>新增</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.xxLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  locationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationItem: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  locationText: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: COLORS.alert,
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});

export default LocationSelectScreen;
