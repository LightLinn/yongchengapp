import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerCarousel from '../components/BannerCarousel';
import NewsItem from '../components/NewsItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchNews } from '../../api/newsApi';
import { fetchBannerImages } from '../../api/bannerApi'; 
import { COLORS, SIZES } from '../../styles/theme';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUsername) setUsername(storedUsername);
      if (storedUserId) setUserId(storedUserId);
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const loadBanners = async () => {
    try {
      const bannerData = await fetchBannerImages();
      setBanners(bannerData);
    } catch (error) {
      console.error('Failed to load banners', error);
    }
  };

  const loadNews = async () => {
    setLoading(true);
    try {
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (error) {
      console.error('Failed to load news', error);
    } finally {
      setLoading(false); // 結束加載數據
    }
  };

  const loadData = async () => {
    await loadUserData();
    await loadBanners();
    await loadNews();
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <BannerCarousel banners={banners} />
      <View style={styles.newsSection}>
        <Text style={styles.newsTitle}>最新消息</Text>
        <FlatList
          data={news}
          renderItem={({ item }) => <NewsItem news={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  newsSection: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default HomeScreen;
