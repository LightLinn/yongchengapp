import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { fetchGroupUsers, addUserToGroup, removeUserFromGroup, fetchUserSuggestions } from '../../../api/groupApi';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, FONT } from '../../../styles/theme';

const GroupUserListScreen = () => {
  const { groupId, groupName } = useLocalSearchParams();
  const [groupUsers, setGroupUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadGroupUsers = async () => {
      try {
        const users = await fetchGroupUsers(groupId);
        setGroupUsers(users);
      } catch (error) {
        console.error('Failed to load group users', error);
      }
    };

    if (groupId) {
      loadGroupUsers();
    }
  }, [groupId]);

  const handleAddUser = async () => {
    try {
      const success = await addUserToGroup(groupId, newUsername);
      if (success) {
        setGroupUsers([...groupUsers, { username: newUsername }]);
        setNewUsername('');
        setSuggestions([]);
      } else {
        console.error('Failed to add user to group');
      }
    } catch (error) {
      console.error('Failed to add user to group', error);
    }
  };

  const handleRemoveUser = async (username) => {
    alert("此操作目前不可使用。");
    return;

    try {
      const success = await removeUserFromGroup(groupId, username);
      if (success) {
        setGroupUsers(groupUsers.filter(user => user.username !== username));
      } else {
        console.error('Failed to remove user from group');
      }
    } catch (error) {
      console.error('Failed to remove user from group', error);
    }
  };

  const handleUsernameChange = async (text) => {
    setNewUsername(text);
    if (text.length > 2) {
      try {
        const results = await fetchUserSuggestions(text);
        setSuggestions(results);
      } catch (error) {
        console.error('Failed to fetch user suggestions', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (username) => {
    setNewUsername(username);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupName}>{groupName}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="新增使用者"
          value={newUsername}
          onChangeText={handleUsernameChange}
        />
        <TouchableOpacity onPress={handleAddUser}>
          <Icon name="add" size={SIZES.large} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} onPress={() => handleSuggestionPress(suggestion.username)}>
              <Text style={styles.suggestionItem}>{suggestion.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FlatList
        data={groupUsers}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text style={styles.username}>{item.username}</Text>
            <TouchableOpacity onPress={() => handleRemoveUser(item.username)}>
              <Icon name="remove" size={SIZES.large} color={COLORS.alert} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  groupName: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  username: {
    fontSize: 16,
    color: COLORS.gray3,
  },
});

export default GroupUserListScreen;
