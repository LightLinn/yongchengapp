import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Divider } from 'react-native-elements';
import { useAuth } from '../../../context/AuthContext'; // 获取用户信息


const MenuScreen = () => {
  const router = useRouter();
  const { isLogging } = useAuth(); // 获取当前用户信息
  const groups = ['admin']; // 获取用户权限

  const renderSection = (title, features) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{title}</Card.Title>
      <Card.Divider />
      {features.map((feature, index) => (
        <TouchableOpacity key={index} onPress={feature.action}>
          <Text style={styles.featureText}>{feature.name}</Text>
          {index < features.length - 1 && <Divider style={styles.divider} />}
        </TouchableOpacity>
      ))}
    </Card>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {isLogging && groups.includes('admin') && renderSection('審核管理', [
          { name: '查看審核', action: () => router.push('/screens/audit') },
        ])}
        {isLogging && renderSection('後台管理', [
          { name: '權限管理', action: () => router.push('/screens/group/GroupListScreen') },
        ])}
        {isLogging && renderSection('場地管理', [
          { name: '新增場地', action: () => router.push('/screens/venue/VenueAddScreen') },
          { name: '查看場地', action: () => router.push('/screens/venue/VenueScreen') },
        ])}
        {isLogging && renderSection('教學日誌', [
          { name: '新增日誌', action: () => router.push('/screens/teaching-log/add') },
          { name: '查看日誌', action: () => router.push('/screens/teaching-log/view') },
        ])}
        {isLogging && renderSection('工作日誌', [
          { name: '新增日誌', action: () => router.push('/screens/work-log/add') },
          { name: '查看日誌', action: () => router.push('/screens/work-log/view') },
        ])}
        {isLogging && renderSection('報修管理', [
          { name: '申請報修', action: () => router.push('/screens/repair/add') },
          { name: '查看進度', action: () => router.push('/screens/repair/view') },
        ])}
        {isLogging && renderSection('班表管理', [
          { name: '查看班表', action: () => router.push('/screens/schedule/view') },
          { name: '新增班表', action: () => router.push('/screens/schedule/add') },
        ])}
        {isLogging && renderSection('出勤管理', [
          { name: '查看紀錄', action: () => router.push('/screens/attendance/view') },
        ])}
        {isLogging && renderSection('消息管理', [
          { name: '新增消息', action: () => router.push('/screens/news/add') },
          { name: '查看消息', action: () => router.push('/screens/news/view') },
        ])}
        {isLogging && renderSection('動態管理', [
          // 如果有其他子功能，可以在这里添加
        ])}
        {isLogging && renderSection('通知管理', [
          { name: '新增通知', action: () => router.push('/screens/notification/add') },
          { name: '查看通知', action: () => router.push('/screens/notification/view') },
        ])}
        
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    padding: 10,
  },
  divider: {
    backgroundColor: '#ccc',
    height: 1,
  },
});

export default MenuScreen;
