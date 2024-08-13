import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useAuth } from '../../../context/AuthContext';
import { fetchWorklogs } from '../../../api/worklogApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter } from 'expo-router';

const WorklogScreen = () => {
  const [viewMode, setViewMode] = useState('calendar');
  const [worklogs, setWorklogs] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadWorklogs();
  }, []);

  const loadWorklogs = async () => {
    setLoading(true);
    try {
      const data = await fetchWorklogs();
      const formattedWorklogs = formatWorklogs(data);
      setWorklogs(formattedWorklogs);
    } catch (error) {
      console.error('Failed to load worklogs', error);
      Alert.alert('無法加載工作日誌');
    } finally {
      setLoading(false);
    }
  };

  const formatWorklogs = (data) => {
    const formatted = {};
    data.forEach(worklog => {
      const date = moment(worklog.date).format('YYYY-MM-DD');
      if (!formatted[date]) {
        formatted[date] = [];
      }
      formatted[date].push(worklog);
    });
    return formatted;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderWorklogDetails = () => {
    const dailyWorklogs = worklogs[selectedDate] || [];
    if (dailyWorklogs.length === 0) {
      return <Text style={styles.noDataText}></Text>;
    }
    return dailyWorklogs.map(worklog => (
      <TouchableOpacity 
        key={worklog.id} 
        style={styles.detailCard} 
        onPress={() => router.push(`/screens/worklog/WorklogDetailScreen?id=${worklog.id}`)}
      >
        <Text style={styles.cardText}>{worklog.description}</Text>
        <Text style={styles.cardText}>時間: {moment(worklog.duty.start_time, 'HH:mm:ss').format('HH:mm')}</Text>
        <Text style={styles.cardText}>地點: {worklog.duty.venue}</Text>
      </TouchableOpacity>
    ));
  };

  const handleCreateNewLog = () => {
    router.push('/screens/worklog/CreateWorklogScreen');
  };

  const renderCalendarView = () => {
    const markedDates = {};
    Object.keys(worklogs).forEach(date => {
      markedDates[date] = { marked: true, dotColor: COLORS.primary };
    });
    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: COLORS.primary };

    return (
      <View>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNewLog}>
          <Text style={styles.createButtonText}>建立新日誌</Text>
        </TouchableOpacity>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
          }}
          hideExtraDays={true}
          hideArrows={false}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.dateText}>{moment(selectedDate).format('YYYY/MM/DD')}</Text>
          {renderWorklogDetails()}
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      {viewMode === 'calendar' ? renderCalendarView() : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  detailsContainer: {
    padding: 10,
  },
  dateText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  detailCard: {
    backgroundColor: COLORS.lightWhite,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: COLORS.gray2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: SIZES.xxLarge,
  },
  noDataText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default WorklogScreen;