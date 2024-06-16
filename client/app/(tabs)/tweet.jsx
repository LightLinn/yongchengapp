import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { fetchTweets, postTweet } from '../../api/tweetApi';
import TweetItem from '../components/TweetItem';
import { COLORS, SIZES, FONT } from '../../styles/theme';

// const TweetScreen = () => {
//   const [tweetContent, setTweetContent] = useState('');
//   const [tweets, setTweets] = useState([]);

//   useEffect(() => {
//     const loadTweets = async () => {
//       try {
//         const fetchedTweets = await fetchTweets();
//         setTweets(fetchedTweets);
//       } catch (error) {
//         console.error('Failed to load tweets', error);
//       }
//     };

//     loadTweets();
//   }, []);

//   const handlePostTweet = async () => {
//     if (tweetContent.trim()) {
//       const newTweet = {
//         username: 'Current User',
//         content: tweetContent,
//         created_at: new Date().toISOString(),
//       };
//       const savedTweet = await postTweet(newTweet);
//       setTweets([savedTweet, ...tweets]);
//       setTweetContent('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.inputContainer}>
//         <Input
//           placeholder="What's happening?"
//           value={tweetContent}
//           onChangeText={setTweetContent}
//           containerStyle={styles.input}
//         />
//         <Button title="Tweet" onPress={handlePostTweet} buttonStyle={styles.button} />
//       </View>
//       <FlatList
//         data={tweets}
//         renderItem={({ item }) => <TweetItem tweet={item} />}
//         keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // 防止id为undefined的情况
//         contentContainerStyle={styles.tweetList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: COLORS.bg,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     marginRight: 10,
//   },
//   button: {
//     backgroundColor: COLORS.primary,
//   },
//   tweetList: {
//     paddingBottom: 20,
//   },
// });

// export default TweetScreen;

const TweetScreen = () => {
  return (
    <View style={styles.container}>
      <Text >近期開放</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default TweetScreen;


'/home/tcstudio/tcstudioweb'