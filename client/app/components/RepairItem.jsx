import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../styles/theme';
import dayjs from 'dayjs';

const RepairItem = ({ repair, venueName }) => {
  const router = useRouter();

  const getStatusText = (status) => {
    switch (status) {
      case '未處理':
        return '未處理';
      case '處理中':
        return '處理中';
      case '已處理':
        return '已處理';
      default:
        return '未知狀態';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push(`/screens/repair/RepairDetailScreen?repairId=${repair.id}&venueName=${venueName}`)}
    >
      <Text style={styles.title}>{repair.title}</Text>
      <Text style={styles.description} multiline>描述 {repair.description}</Text>
      <Text style={styles.status}>狀態 {getStatusText(repair.repair_status)}</Text>
      <Text style={styles.venue}>場地 {venueName}</Text>
      <Text style={styles.createdAt}>日期 {dayjs(repair.created_at).format('YYYY/MM/DD HH:MM')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.gray,
  },
  status: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.gray,
  },
  venue: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.gray,
  },
  createdAt: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default RepairItem;
