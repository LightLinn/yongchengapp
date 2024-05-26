import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchNewsDetail } from '../../../api/newsApi';

const NewsDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [newsDetail, setNewsDetail] = useState(null);

  useEffect(() => {
    const loadNewsDetail = async () => {
      try {
        const data = await fetchNewsDetail(id);
        // setNewsDetail(data);
      } catch (error) {
        console.error('Failed to load news detail', error);
        setNewsDetail([
          {
            title: '演示新聞標題',
            content: '這是一篇演示用的新聞內容。這篇新聞詳細描述了一些演示信息，並展示了如何在應用中顯示新聞的詳細內容。',
          },
        ]);
      }
    };

    if (id) {
      loadNewsDetail();
    }
  }, [id]);

  if (!newsDetail) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{newsDetail.title}</Text>
      <Text style={styles.content}>{newsDetail.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },
});

export default NewsDetailScreen;
