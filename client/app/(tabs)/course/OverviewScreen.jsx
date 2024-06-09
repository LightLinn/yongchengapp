import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, RefreshControl } from 'react-native';
import EnrollCard from '../../components/EnrollCard';
import { fetchEnrollments, fetchEnrollmentsCoach, fetchCoaches, fetchCourseTypes, fetchVenues } from '../../../api/courseApi';
import { useAuth } from '../../../context/AuthContext'; 
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OverviewScreen = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);
  const { refreshAccessToken } = useAuth();
  
  const checkIsCoach = async () => {
    const role = await AsyncStorage.getItem('groups');
    return role.includes("內部_教練");
  };

  const loadData = async () => {
    // await refreshAccessToken();
    const isCoach = await checkIsCoach();
    const fetchedEnrollments = isCoach ? await fetchEnrollmentsCoach() : await fetchEnrollments();
    
    const fetchedCoaches = await fetchCoaches();
    const fetchedCourseTypes = await fetchCourseTypes();
    const fetchedVenues = await fetchVenues();
    setEnrollments(fetchedEnrollments);
    setCoaches(fetchedCoaches);
    setCourseTypes(fetchedCourseTypes);
    setVenues(fetchedVenues);
    
  };
  
  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleSort = (sortOption) => {
    setSelectedSort(sortOption);
    const sortedEnrollments = [...enrollments];
    if (sortOption === 'newest') {
      sortedEnrollments.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    } else {
      sortedEnrollments.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    }
    setEnrollments(sortedEnrollments);
  };

  const filteredEnrollments = enrollments.filter(enroll => {
    const coach = enroll.coach?.user?.nickname || '';
    const courseType = enroll.coursetype?.name || '';
    const venue = enroll.venue?.name || '';

    return (
      (enroll.student && enroll.student.includes(searchText)) ||
      (coach && coach.includes(searchText)) ||
      (courseType && courseType.includes(searchText)) ||
      (venue && venue.includes(searchText)) ||
      (enroll.enrollment_status && enroll.enrollment_status.includes(searchText)) ||
      (enroll.start_date && enroll.start_date.includes(searchText)) ||
      (enroll.start_time && enroll.start_time.includes(searchText))
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchSortContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索"
          value={searchText}
          onChangeText={handleSearch}
        />
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, selectedSort === 'newest' && styles.selectedSortButton]}
            onPress={() => handleSort('newest')}
          >
            <Text style={styles.sortButtonText}>最新</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, selectedSort === 'oldest' && styles.selectedSortButton]}
            onPress={() => handleSort('oldest')}
          >
            <Text style={styles.sortButtonText}>最早</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredEnrollments.map((enroll) => (
          <EnrollCard key={enroll.id} enroll={enroll} coaches={coaches} courseTypes={courseTypes} venues={venues} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 10,
  },
  searchSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginLeft: 5,
  },
  selectedSortButton: {
    backgroundColor: COLORS.secondary,
  },
  sortButtonText: {
    color: COLORS.gray2,
    fontSize: SIZES.medium,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
});

export default OverviewScreen;
