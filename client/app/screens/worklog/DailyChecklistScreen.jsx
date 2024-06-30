import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, Alert } from 'react-native';
import { fetchDailyChecklists, submitDailyCheckRecord } from '../../../api/worklogApi';

const DailyChecklistScreen = () => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [records, setRecords] = useState({});

  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const data = await fetchDailyChecklists();
        setChecklistItems(data);
      } catch (error) {
        console.error('Failed to fetch checklists', error);
      }
    };

    loadChecklists();
  }, []);

  const handleChange = (item, value) => {
    setRecords({ ...records, [item]: value });
  };

  const handleSubmit = async () => {
    try {
      await submitDailyCheckRecord(records);
      Alert.alert('提交成功', '每日檢點表已提交');
    } catch (error) {
      console.error('Failed to submit records', error);
      Alert.alert('提交失敗', '每日檢點表提交失敗');
    }
  };

  return (
    <ScrollView>
      {checklistItems.map((item, index) => (
        <View key={index}>
          <Text>{item.item}</Text>
          <TextInput
            placeholder="輸入結果"
            onChangeText={(text) => handleChange(item.id, text)}
          />
        </View>
      ))}
      <Button title="提交" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default DailyChecklistScreen;
