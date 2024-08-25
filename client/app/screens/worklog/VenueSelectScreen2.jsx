import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchVenues } from '../../../api/venueApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const VenueSelectScreen = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 从 router.query 中获取传递的参数
  const { type } = useLocalSearchParams();

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await fetchVenues();
      setVenues(data);
    } catch (error) {
      console.error('Failed to load venues', error);
      Alert.alert('無法加載場地');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVenue = (venue) => {
    if ( type === 'daily' ) {
      router.push(`/screens/worklog/DailyRecordsScreen?venueId=${venue.id}&venueName=${venue.name}`);
    } else if ( type === 'periodic' ) {
      router.push(`/screens/worklog/PeriodicRecordsScreen?venueId=${venue.id}&venueName=${venue.name}`);
    } else if ( type === 'special' ) {
      router.push(`/screens/worklog/SpecialRecordsScreen?venueId=${venue.id}&venueName=${venue.name}`);
    }          
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handleSelectVenue(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  headerText: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default VenueSelectScreen;
