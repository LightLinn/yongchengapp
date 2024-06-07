import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import QrCodeScanner from '../../components/QrCodeScanner';
import { fetchAttendanceRecords } from '../../../api/attendApi';
import AttendanceRecordItem from '../../components/AttendanceRecordItem';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';

const AttendanceScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadAttendanceRecords = async () => {
      try {
        
        const records = await fetchAttendanceRecords();
        setAttendanceRecords(records);
      } catch (error) {
        console.error('Failed to load attendance records:', error);
      }
    };

    loadAttendanceRecords();
  }, []);

  const handleScan = (data) => {
    setScanResult(data);
    setIsScanning(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    return (
      record.course.enrollment_list.venue?.name.includes(searchText) ||
      record.course.enrollment_list.coach?.user.nickname.includes(searchText) ||
      record.created_at.includes(searchText) ||
      record.course.enrollment_list.enrollment_number?.includes(searchText) ||
      record.status.includes(searchText)
    );
  });

  return (
    <View style={styles.container}>
      {isScanning ? (
        <QrCodeScanner onScan={handleScan} onClose={() => setIsScanning(false)} />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
            <Text style={styles.scanButtonText}>打開相機掃描</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.scanResultInput}
            placeholder="掃描結果"
            value={scanResult}
            editable={false}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索"
            value={searchText}
            onChangeText={handleSearch}
          />
          {filteredRecords.map((record) => (
            <AttendanceRecordItem key={record.id} record={record} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  scanResultInput: {
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: COLORS.warning2,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: SIZES.medium,
  },
});

export default AttendanceScreen;
