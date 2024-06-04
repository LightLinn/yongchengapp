// src/screens/worklog/WorklogScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { fetchWorklogs } from '../../../api/worklogApi'; // 假设从单独的 API 文件中导入
import { COLORS, SIZES } from '../../../styles/theme';

const WorklogScreen = () => {
  const [worklogs, setWorklogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadWorklogs = async () => {
      try {
        const fetchedWorklogs = await fetchWorklogs();
        setWorklogs(fetchedWorklogs);
      } catch (error) {
        console.error('Failed to load worklogs', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorklogs();
  }, []);

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.title}</Card.Title>
      <Card.Divider />
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>Created At: {new Date(item.created_at).toLocaleString()}</Text>
      <Text style={styles.timestamp}>Updated At: {new Date(item.updated_at).toLocaleString()}</Text>
      <Button
        title="查看詳情"
        onPress={() => router.push(`/screens/worklog/WorklogDetailScreen?id=${item.id}`)}
        buttonStyle={styles.detailButton}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={worklogs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.lightWhite,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  content: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 5,
  },
  detailButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
});

export default WorklogScreen;
