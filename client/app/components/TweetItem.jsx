import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TweetItem = ({ tweet }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{tweet.username}</Text>
      <Text style={styles.content}>{tweet.content}</Text>
      <Text style={styles.timestamp}>{new Date(tweet.timestamp).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  username: {
    fontWeight: 'bold',
  },
  content: {
    marginVertical: 5,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
  },
});

export default TweetItem;
