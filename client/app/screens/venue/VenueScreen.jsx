import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchVenues, deleteVenue } from '../../../api/venueApi';
import { COLORS, SIZES } from '../../../styles/theme';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../context/PermissionsContext';

const VenueScreen = () => {
  const router = useRouter();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortAscending, setSortAscending] = useState(true);
  const { groupIds } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();

  const loadVenues = async () => {
    try {
      const venueList = await fetchVenues();
      setVenues(venueList);
      setFilteredVenues(venueList);
    } catch (error) {
      console.error('Failed to fetch venues', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (groupIds && groupIds.length > 0) {
      loadVenues();
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadVenues();
  }, []);

  const handleDelete = async (id) => {
    if (!hasPermission('can_delete')) {
      alert('你沒有刪除場地的權限');
      return;
    }
    try {
      await deleteVenue(id);
      loadVenues(); // Reload venues list after deletion
    } catch (error) {
      console.error('Failed to delete venue', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterVenues(text);
  };

  const filterVenues = (text) => {
    const filtered = venues.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(text.toLowerCase());
      const dateMatch = dayjs(item.created_at).format('YYYY/MM/DD HH:MM').includes(text);
      return nameMatch || dateMatch;
    });
    setFilteredVenues(filtered);
  };

  const sortVenues = () => {
    const sorted = [...filteredVenues].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredVenues(sorted);
    setSortAscending(!sortAscending);
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name === 'venue_screen');
    return permission && permission[action];
  };

  if (loading || permissionsLoading) {
    return <LoadingSpinner />;
  }

  if (!hasPermission('can_view')) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text>你沒有查看場地的權限</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋場地名稱或日期"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={sortVenues} style={styles.sortButton}>
          <Ionicons name={sortAscending ? "arrow-down" : "arrow-up"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredVenues}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.venueItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{dayjs(item.created_at).format('YYYY/MM/DD HH:MM')}</Text>
            <View style={styles.actions}>
              {hasPermission('can_edit') && (
                <TouchableOpacity onPress={() => router.push(`/screens/venue/VenueFormScreen?id=${item.id}`)}>
                  <Ionicons name="pencil" size={SIZES.xLarge} color={COLORS.gray} />
                </TouchableOpacity>
              )}
              {hasPermission('can_delete') && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={SIZES.large} color={COLORS.gray} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.managers}>
              {item.managers.map(manager => (
                <TouchableOpacity key={manager.id} onPress={() => router.push(`/screens/user/UserDetailScreen?id=${manager.id}`)}>
                  <Text style={styles.manager}>{manager.username}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
      {hasPermission('can_create') && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/screens/venue/VenueFormScreen')}
        >
          <Ionicons name="add" size={30} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 10,
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  venueItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  date: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    marginBottom: 5,
  },
  managers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  manager: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginRight: 10,
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default VenueScreen;
