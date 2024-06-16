import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchNews, deleteNews } from '../../../api/newsApi';
import { COLORS, SIZES } from '../../../styles/theme';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useAuth } from '../../../context/AuthContext';
import { usePermissions } from '../../../context/PermissionsContext';

const NewsListScreen = () => {
  const router = useRouter();
  const [newsList, setNewsList] = useState([]);
  const [filteredNewsList, setFilteredNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortAscending, setSortAscending] = useState(true);
  const { groupIds } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();

  const loadNews = async () => {
    try {
      const news = await fetchNews();
      setNewsList(news);
      setFilteredNewsList(news);
    } catch (error) {
      console.error('Failed to fetch news', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (groupIds && groupIds.length > 0) {
      loadNews();
    }
  }, [groupIds]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNews();
  }, []);

  const handleDelete = async (id) => {
    if (!hasPermission('can_delete')) {
      alert('你沒有刪除消息的權限');
      return;
    }
    try {
      await deleteNews(id);
      loadNews(); // Reload news list after deletion
    } catch (error) {
      console.error('Failed to delete news', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterNews(text);
  };

  const filterNews = (text) => {
    const filtered = newsList.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(text.toLowerCase());
      const dateMatch = dayjs(item.created_at).format('YYYY/MM/DD').includes(text);
      return titleMatch || dateMatch;
    });
    setFilteredNewsList(filtered);
  };

  const sortNews = () => {
    const sorted = [...filteredNewsList].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredNewsList(sorted);
    setSortAscending(!sortAscending);
  };

  const hasPermission = (action) => {
    const permission = permissions.find(p => p.screen_name === 'news_screen');
    return permission && permission[action];
  };

  if (loading || permissionsLoading) {
    return <LoadingSpinner />;
  }

  if (!hasPermission('can_view')) {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text>你沒有查看消息的權限</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋標題或日期"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={sortNews} style={styles.sortButton}>
          <Ionicons name={sortAscending ? "arrow-down" : "arrow-up"} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredNewsList}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{dayjs(item.created_at).format('YYYY/MM/DD')}</Text>
            <View style={styles.actions}>
              {hasPermission('can_edit') && (
                <TouchableOpacity onPress={() => router.push(`/screens/news/NewsFormScreen?id=${item.id}`)}>
                  <Ionicons name="pencil" size={SIZES.xLarge} color={COLORS.gray} />
                </TouchableOpacity>
              )}
              {hasPermission('can_delete') && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={SIZES.large} color={COLORS.gray} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
      {hasPermission('can_create') && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/screens/news/NewsFormScreen')}
        >
          <Ionicons name="add" size={30} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 10,
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
  },
  newsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: SIZES.medium,
    flex: 1,
  },
  date: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default NewsListScreen;
