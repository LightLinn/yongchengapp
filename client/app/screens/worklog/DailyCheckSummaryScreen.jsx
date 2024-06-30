import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { fetchDailyCheckRecords } from '../../../api/worklogApi';

const DailyCheckSummaryScreen = ({ venueId, month }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await fetchDailyCheckRecords(venueId, month);
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch records', error);
      }
    };

    loadRecords();
  }, [venueId, month]);

  return (
    <ScrollView>
      {records.map((record, index) => (
        <View key={index}>
          <Text>{record.date} - {record.check_item.item} - {record.score}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default DailyCheckSummaryScreen;
