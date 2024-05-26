import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { fetchTweets, postTweet } from '../../api/tweetApi';
import TweetItem from '../components/TweetItem';

const TweetScreen = () => {
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const loadTweets = async () => {
      try {
        const fetchedTweets = await fetchTweets();
        // setTweets(fetchedTweets);
        setTweets([
          { id: 1, username: 'User1', content: '這是第一條推文', timestamp: '2024-05-01T12:00:00Z' },
          { id: 2, username: 'User2', content: '這是第二條推文', timestamp: '2024-05-02T14:00:00Z' },
          { id: 3, username: 'User3', content: '這是第三條推文', timestamp: '2024-05-03T16:00:00Z' },
          { id: 4, username: 'User4', content: '這是第四條推文', timestamp: '2024-05-04T18:00:00Z' },
          { id: 5, username: 'User5', content: '這是第五條推文', timestamp: '2024-05-05T20:00:00Z' },
          { id: 6, username: 'User6', content: '這是第六條推文', timestamp: '2024-05-06T22:00:00Z' },
          { id: 7, username: 'User7', content: '這是第七條推文', timestamp: '2024-05-07T08:00:00Z' },
          { id: 8, username: 'User8', content: '這是第八條推文', timestamp: '2024-05-08T10:00:00Z' },
          { id: 9, username: 'User9', content: '這是第九條推文', timestamp: '2024-05-09T12:00:00Z' },
          { id: 10, username: 'User10', content: '這是第十條推文', timestamp: '2024-05-10T14:00:00Z' },
        ]);
      } catch (error) {
        console.error('Failed to load tweets', error);
        
        
      }
    };

    loadTweets();
  }, []);

  const handlePostTweet = async () => {
    if (tweetContent.trim()) {
      const newTweet = {
        username: 'Current User', 
        content: tweetContent,
        timestamp: new Date().toISOString(),
      };
      const savedTweet = await postTweet(newTweet);
      setTweets([savedTweet, ...tweets]);
      setTweetContent('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          placeholder="What's happening?"
          value={tweetContent}
          onChangeText={setTweetContent}
          containerStyle={styles.input}
        />
        <Button title="Tweet" onPress={handlePostTweet} buttonStyle={styles.button} />
      </View>
      <FlatList
        data={tweets}
        renderItem={({ item }) => <TweetItem tweet={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.tweetList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#1DA1F2',
  },
  tweetList: {
    paddingBottom: 20,
  },
});

export default TweetScreen;
