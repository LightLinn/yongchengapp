import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../styles/theme';

const NewsItem = ({ news }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.touchable} onPress={() => router.push(`/screens/news/NewsDetailScreen?id=${news.id}`)}>
        <Text style={styles.title}>{news.title}</Text>
        <Icon name="chevron-right" type="feather" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightWhite,
  },
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.medium,
    flex: 1,
    color: COLORS.gray3,
    
  },
});

export default NewsItem;
