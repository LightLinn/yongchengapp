import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { fetchRegistrations } from '../../../api/courseApi';

const EnrollmentStatusScreen = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const fetchedRegistrations = await fetchRegistrations();
        setRegistrations(fetchedRegistrations);
      } catch (error) {
        console.error('Failed to fetch registrations', error);
        setRegistrations([
          {
            id: 1,
            studentName: '張三',
            courseType: '游泳初級班',
            completedClasses: 5,
            totalClasses: 10,
            status: '進行中',
          },
          {
            id: 2,
            studentName: '李四',
            courseType: '游泳高級班',
            completedClasses: 8,
            totalClasses: 12,
            status: '進行中',
          },
          {
            id: 3,
            studentName: '王五',
            courseType: '游泳中級班',
            completedClasses: 12,
            totalClasses: 12,
            status: '已完成',
          },
        ])
      }
    };

    loadRegistrations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text>學生名稱: {item.studentName}</Text>
      <Text>課程類型: {item.courseType}</Text>
      <Text>進度: {item.completedClasses}/{item.totalClasses}</Text>
      <Text>報名狀態: {item.status}</Text>
    </View>
  );

  return (
    <FlatList
      data={registrations}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    backgroundColor: '#fff',
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
});

export default EnrollmentStatusScreen;
