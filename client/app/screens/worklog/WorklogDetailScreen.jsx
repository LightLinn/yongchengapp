import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import { useLocalSearchParams } from 'expo-router';
import { fetchWorklogDetail, updateWorklog } from '../../../api/worklogApi';
import { COLORS, SIZES } from '../../../styles/theme';

const WorklogDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [worklog, setWorklog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadWorklogDetail();
  }, [id]);

  const loadWorklogDetail = async () => {
    setLoading(true);
    try {
      const fetchedWorklog = await fetchWorklogDetail(id);
      setWorklog(fetchedWorklog);
    } catch (error) {
      console.error('Failed to load worklog detail', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateWorklog(id, worklog);
      Alert.alert('Success', 'Worklog updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update worklog', error);
      Alert.alert('Error', 'Failed to update worklog');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!worklog) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load worklog detail.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          value={worklog.title}
          editable={isEditing}
          onChangeText={(value) => setWorklog({ ...worklog, title: value })}
        />
        <Card.Divider />
        <TextInput
          style={styles.input}
          value={worklog.content}
          editable={isEditing}
          multiline
          onChangeText={(value) => setWorklog({ ...worklog, content: value })}
        />
        <Text style={styles.timestamp}>Created At: {new Date(worklog.created_at).toLocaleString()}</Text>
        <Text style={styles.timestamp}>Updated At: {new Date(worklog.updated_at).toLocaleString()}</Text>
        <Text style={styles.status}>Status: {worklog.status}</Text>
        <Text style={styles.usageCount}>Usage Count: {worklog.usage_count}</Text>
        <Text style={styles.isFinal}>Is Final: {worklog.is_final ? 'Yes' : 'No'}</Text>
        <Card.Divider />
        <Text style={styles.subTitle}>Daily Checks</Text>
        {worklog.daily_checks && worklog.daily_checks.map(check => (
          <Text key={check.id} style={styles.check}>{check.check_item.item} - {check.score}</Text>
        ))}
        <Card.Divider />
        <Text style={styles.subTitle}>Periodic Checks</Text>
        {worklog.periodic_checks && worklog.periodic_checks.map(check => (
          <Text key={check.id} style={styles.check}>{check.check_item.item} - {check.value}</Text>
        ))}
        <Card.Divider />
        <Text style={styles.subTitle}>Special Checks</Text>
        {worklog.special_checks && worklog.special_checks.map(check => (
          <Text key={check.id} style={styles.check}>{check.check_item.item} - {check.quantity}</Text>
        ))}
        {isEditing ? (
          <Button title="Save" onPress={handleSave} />
        ) : (
          <Button title="Edit" onPress={() => setIsEditing(true)} />
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightWhite,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  input: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 5,
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    marginBottom: 5,
  },
  usageCount: {
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    marginBottom: 5,
  },
  isFinal: {
    fontSize: SIZES.medium,
    color: COLORS.tertiary,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 10,
  },
  check: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginBottom: 5,
  },
});

export default WorklogDetailScreen;
