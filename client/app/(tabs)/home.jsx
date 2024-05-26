import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerCarousel from '../components/BannerCarousel';
import NewsItem from '../components/NewsItem';
import { fetchBannerImages, fetchNews } from '../../api/newsApi';

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [banners, setBanners] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
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
        // 使用演示用的資料
        const demoBanners = [
          { id: 1, imageUrl: 'https://via.placeholder.com/468x126.png?text=Banner+1' },
          { id: 2, imageUrl: 'https://via.placeholder.com/468x126.png?text=Banner+2' },
          { id: 3, imageUrl: 'https://via.placeholder.com/468x126.png?text=Banner+3' },
        ];
        setBanners(demoBanners);
      }
    };

    const loadNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (error) {
        console.error('Failed to load news', error);
        // 使用演示用的資料
        const demoNews = [
          { id: 1, title: '演示新聞標題 1', content: '這是演示新聞 1 的內容' },
          { id: 2, title: '演示新聞標題 2', content: '這是演示新聞 2 的內容' },
          { id: 3, title: '演示新聞標題 3', content: '這是演示新聞 3 的內容' },
          { id: 4, title: '演示新聞標題 4', content: '這是演示新聞 4 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
          { id: 5, title: '演示新聞標題 5', content: '這是演示新聞 5 的內容' },
        ];
        setNews(demoNews);
      }
    };

    loadUserData();
    loadBanners();
    loadNews();
  }, []);

  return (
    <View style={styles.container}>
      <BannerCarousel banners={banners} />
      <View style={styles.newsSection}>
        <Text style={styles.newsTitle}>News</Text>
        <FlatList
          data={news}
          renderItem={({ item }) => <NewsItem news={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
