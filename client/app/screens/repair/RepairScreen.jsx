import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchRepairs } from '../../../api/repairApi';
import { fetchVenueDetails } from '../../../api/venueApi';
import RepairItem from '../../components/RepairItem';
import { COLORS, SIZES } from '../../../styles/theme';
import { usePermissions } from '../../../context/PermissionsContext';
import { useAuth } from '../../../context/AuthContext';

const RepairScreen = () => {
  const [repairs, setRepairs] = useState([]);
  const [venues, setVenues] = useState({});
  const [filter, setFilter] = useState('');
  const [sortedBy, setSortedBy] = useState('created_at');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { groupIds } = useAuth();
  const { permissions, loading, refresh } = usePermissions();

  const loadRepairs = async () => {
    try {
      const fetchedRepairs = await fetchRepairs();
      const venuePromises = fetchedRepairs.map(repair => fetchVenueDetails(repair.venue));
      const venuesArray = await Promise.all(venuePromises);
      const venuesMap = {};
      venuesArray.forEach(venue => {
        venuesMap[venue.id] = venue.name;
      });
      setVenues(venuesMap);
      setRepairs(fetchedRepairs);
    } catch (error) {
      console.error('Failed to load repairs', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRepairs();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRepairs().then(() => setRefreshing(false));
  }, []);

  const handleSort = (criteria) => {
    let sortedData = [...repairs];
    if (criteria === 'created_at') {
      sortedData = sortedData.sort((a, b) => new Date(a[criteria]) - new Date(b[criteria]));
    } else if (criteria === 'created_at_desc') {
      sortedData = sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (criteria === 'repair_status') {
      sortedData = sortedData.sort((a, b) => a[criteria].localeCompare(b[criteria]));
    }
    setSortedBy(criteria);
    setRepairs(sortedData);
    setShowSortMenu(false);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const hasPermission = (screenName, action) => {
    const permission = permissions.find(p => p.screen_name === screenName);
    return permission && permission[action];
  };

  const filteredRepairs = repairs.filter(item => 
    (item.title.includes(filter) || item.description.includes(filter)) && 
    (statusFilter ? item.repair_status === statusFilter : true)
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={SIZES.xLarge} color={COLORS.primary} />
          <TextInput
            placeholder="搜尋"
            value={filter}
            onChangeText={setFilter}
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity onPress={() => setShowSortMenu(!showSortMenu)}>
          <Icon name="sort" size={SIZES.xLarge} color={COLORS.primary} />
        </TouchableOpacity>
        {hasPermission('維修管理', 'can_create') && (
          <TouchableOpacity onPress={() => router.push('/screens/repair/RepairAddScreen')}>
            <Icon name="add" size={SIZES.xLarge} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
      {showSortMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => handleSort('created_at')}>
            <Text style={styles.dropdownMenuItem}>創建時間舊至新</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('created_at_desc')}>
            <Text style={styles.dropdownMenuItem}>創建時間新至舊</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.statusFilterContainer}>
        <TouchableOpacity onPress={() => handleStatusFilter('')}>
          <Text style={[styles.statusFilter, !statusFilter && styles.activeFilter]}>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('未處理')}>
          <Text style={[styles.statusFilter, statusFilter === '未處理' && styles.activeFilter]}>未處理</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('處理中')}>
          <Text style={[styles.statusFilter, statusFilter === '處理中' && styles.activeFilter]}>處理中</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已處理')}>
          <Text style={[styles.statusFilter, statusFilter === '已處理' && styles.activeFilter]}>已處理</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredRepairs}
        renderItem={({ item }) => <RepairItem repair={item} venueName={venues[item.venue]} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 40,
    right: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  dropdownMenuItem: {
    padding: 5,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statusFilter: {
    padding: 5,
    color: COLORS.gray2,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default RepairScreen;
