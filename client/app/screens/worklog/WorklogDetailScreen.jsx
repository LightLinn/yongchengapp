import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { fetchWorklogDetail } from '../../../api/worklogApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useLocalSearchParams } from 'expo-router';
import moment from 'moment';

const WorklogDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [worklogDetail, setWorklogDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorklogDetail();
  }, []);

  const loadWorklogDetail = async () => {
    setLoading(true);
    try {
      const data = await fetchWorklogDetail(id);
      setWorklogDetail(data);
    } catch (error) {
      console.error('Failed to load worklog detail', error);
      Alert.alert('無法加載工作日誌詳細資料');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>載入中...</Text>;
  }

  if (!worklogDetail) {
    return <Text>無法加載工作日誌詳細資料</Text>;
  }

  const renderDailyCheckRecords = (records) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>每日檢點表</Text>
      {records.map(record => (
        <View key={record.id} style={styles.card}>
          <Text style={styles.cardText}>{record.check_item.item}</Text>
          <Text style={styles.cardText}>分數 {record.score || 'N/A'}</Text>
        </View>
      ))}
    </View>
  );

  const renderPeriodicCheckRecords = (records) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>定時檢點表</Text>
      {records.map(record => (
        <View key={record.id} style={styles.card}>
          <Text style={styles.cardText}>{record.check_item.item}</Text>
          <Text style={styles.cardText}>泳池 {record.pool || 'N/A'}</Text>
          <Text style={styles.cardText}>數值 {record.value || 'N/A'}</Text>
        </View>
      ))}
    </View>
  );

  const renderSpecialCheckRecords = (records) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>特殊檢點表</Text>
      {records.map(record => (
        <View key={record.id} style={styles.card}>
          <Text style={styles.cardText}>{record.check_item.item}</Text>
          <Text style={styles.cardText}>數量 {record.quantity || 'N/A'}</Text>
          <Text style={styles.cardText}>開始時間 {record.start_time || 'N/A'}</Text>
          <Text style={styles.cardText}>結束時間 {record.end_time || 'N/A'}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subTitle}>地點 {worklogDetail.duty.venue}</Text>
        <Text style={styles.subTitle}>日期 {worklogDetail.duty.date}</Text>
        <Text style={styles.subTitle}>時間 {moment(worklogDetail.duty.start_time, 'HH:mm:ss').format('HH:mm')} - {moment(worklogDetail.duty.end_time, 'HH:mm:ss').format('HH:mm')}</Text>
        <Text style={styles.subTitle}>使用人數 {worklogDetail.usage_count}</Text>
        <Text style={styles.subTitle}>描述 {worklogDetail.description}</Text>
      </View>
      
      {renderDailyCheckRecords(worklogDetail.daily_check_record)}
      {renderPeriodicCheckRecords(worklogDetail.periodic_check_record)}
      {renderSpecialCheckRecords(worklogDetail.special_check_record)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: 15,
    marginBottom: 50,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
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
    marginBottom: 5,
  },
});

export default WorklogDetailScreen;
