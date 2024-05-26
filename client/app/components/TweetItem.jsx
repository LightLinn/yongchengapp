import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchTweetComments, postTweetLike, postCommentLike } from '../../api/tweetApi';

const TweetItem = ({ tweet }) => {
  const [likes, setLikes] = useState(tweet.likes);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchTweetComments(tweet.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to load comments', error);
      }
    };
    loadComments();
  }, [tweet.id]);

  const handleLike = async () => {
    try {
      await postTweetLike(tweet.id);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Failed to like tweet', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await postCommentLike(commentId);
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      );
      setComments(updatedComments);
    } catch (error) {
      console.error('Failed to like comment', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{tweet.username}</Text>
      <Text style={styles.content}>{tweet.content}</Text>
      <Text style={styles.timestamp}>{new Date(tweet.created_at).toLocaleString()}</Text>
      <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
        <Text>Like ({likes})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowComments(!showComments)} style={styles.commentButton}>
        <Text>Comments ({comments.length})</Text>
      </TouchableOpacity>
      {showComments && comments.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          <Text>{comment.content}</Text>
          <TouchableOpacity onPress={() => handleCommentLike(comment.id)} style={styles.likeButton}>
            <Text>Like ({comment.likes})</Text>
          </TouchableOpacity>
        </View>
      ))}
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
  likeButton: {
    marginTop: 5,
  },
  commentButton: {
    marginTop: 5,
  },
  commentContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
});

export default TweetItem;
