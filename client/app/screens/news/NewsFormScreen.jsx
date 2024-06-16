import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNews, fetchNewsDetail, updateNews } from '../../../api/newsApi';
import { COLORS, SIZES } from '../../../styles/theme';
import LoadingSpinner from '../../components/LoadingSpinner';

const NewsFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadNewsDetail();
    }
  }, [id]);

  const loadNewsDetail = async () => {
    setLoading(true);
    try {
      const news = await fetchNewsDetail(id);
      setTitle(news.title);
      setContent(news.content);
    } catch (error) {
      console.error('Failed to fetch news detail', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('userId');
    const newsData = {
      title,
      content,
      image: null,
      is_published: true,
      is_deleted: false,
      author: parseInt(userId, 10), // 確保author為數字
    };
    try {
      if (id) {
        await updateNews(id, newsData);
      } else {
        await createNews(newsData);
      }
      router.back();
    } catch (error) {
      console.error('Failed to save news', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>標題</Text>
      <TextInput
        style={styles.input}
        placeholder="輸入標題"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>內容</Text>
      <TextInput
        style={styles.input}
        placeholder="輸入內容"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{id ? '更新消息' : '新增消息'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 20,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: SIZES.medium,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: COLORS.gray,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default NewsFormScreen;
