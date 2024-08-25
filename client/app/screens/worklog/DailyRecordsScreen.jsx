import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchDailyCheckRecordsByVenueId } from '../../../api/worklogApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import moment from 'moment';
import { Table, Row, Rows } from 'react-native-table-component';

const DailyRecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [tableData, setTableData] = useState([]);
  const router = useRouter();
  const { venueId, venueName } = useLocalSearchParams();

  const loadDailyRecords = async () => {
    try {
      const data = await fetchDailyCheckRecordsByVenueId(venueId, selectedMonth);
      setRecords(data);
      generateTableData(data);
    } catch (error) {
      console.error('Failed to load daily records', error);
      Alert.alert('失敗', '無法加載每日檢點表資料');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyRecords();
  }, [venueId, selectedMonth]);

  const generateTableData = (data) => {
    const uniqueItems = Array.from(new Set(data.map(record => record.check_item.item)));
    const uniqueDates = Array.from(new Set(data.map(record => moment(record.created_at).format('YYYY-MM-DD'))));

    const tableHeader = ['項目', ...uniqueDates];
    const tableRows = uniqueItems.map(item => {
      const row = [item];
      uniqueDates.forEach(date => {
        const record = data.find(rec => rec.check_item.item === item && moment(rec.created_at).format('YYYY-MM-DD') === date);
        row.push(record ? record.score : '');
      });
      return row;
    });

    setTableData([tableHeader, ...tableRows]);
  };

  const handleMonthChange = (direction) => {
    const newMonth = moment(selectedMonth).add(direction, 'months').format('YYYY-MM');
    setSelectedMonth(newMonth);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{venueName} - 每日檢點表</Text>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
          <Text style={styles.monthButton}>上一月</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{selectedMonth}</Text>
        <TouchableOpacity onPress={() => handleMonthChange(1)}>
          <Text style={styles.monthButton}>下一月</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: COLORS.gray }}>
            <Row data={tableData[0]} style={styles.head} textStyle={styles.text}/>
            <Rows data={tableData.slice(1)} textStyle={styles.text}/>
          </Table>
        </View>
      </ScrollView>
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
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthButton: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  monthText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  tableContainer: {
    flex: 1,
  },
  head: {
    height: 40,
    backgroundColor: COLORS.primary,
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: COLORS.black,
  },
});

export default DailyRecordsScreen;
