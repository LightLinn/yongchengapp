import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';

const NewsItem = ({ news }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{news.title}</Text>
      <TouchableOpacity onPress={() => router.push(`/screens/news/NewsDetailScreen?id=${news.id}`)}>
        <Icon name="chevron-right" type="feather" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
  },
});

export default NewsItem;
