// src/screens/venue/VenueScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchVenues } from '../../../api/venueApi';
import { fetchUserPermissions } from '../../../api/groupApi';
import VenueItem from '../../components/VenueItem';
import { COLORS } from '../../../styles/theme';
import { useAuth } from '../../../context/AuthContext';

const VenueScreen = () => {
  const [venues, setVenues] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const router = useRouter();
  const { groupIds } = useAuth();

  const loadVenues = async () => {
    try {
      const fetchedVenues = await fetchVenues();
      setVenues(fetchedVenues);
    } catch (error) {
      console.error('Failed to load venues', error);
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

  useEffect(() => {
    if (groupIds && groupIds.length > 0) {
      loadPermissions();
    }
    loadVenues();
  }, [groupIds]);

  useFocusEffect(
    useCallback(() => {
      loadVenues();
    }, [])
  );

  const hasPermission = (screenName, action) => {
    const permission = permissions.find(p => p.screen_name.screen_name === screenName);
    return permission && permission[action];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={venues}
        renderItem={({ item }) => <VenueItem venue={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      {hasPermission('venue_screen', 'can_create') && (
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/screens/venue/VenueAddScreen')}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.lightWhite,
    paddingBottom: 70,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default VenueScreen;
