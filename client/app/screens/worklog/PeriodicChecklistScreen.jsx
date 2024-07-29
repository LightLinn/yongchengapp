import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Alert, StyleSheet, TextInput } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { fetchPeriodicChecklists, createPeriodicCheckRecord, fetchPeriodicCheckRecordsBySchedule, bulkUpdatePeriodicCheckRecords } from '../../../api/worklogApi';
import { fetchLifeguardId, fetchLifeguardSchedules } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import { Card } from 'react-native-elements';
import { COLORS, FONT, SIZES } from '../../../styles/theme';
import { router } from 'expo-router';

const PeriodicChecklistScreen = () => {
  const [checklistItems, setChecklistItems] = useState([]);
  const [records, setRecords] = useState([]);
  const [lifeguardId, setLifeguardId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    const loadChecklists = async () => {
      try {
        const data = await fetchPeriodicChecklists();
        setChecklistItems(data);
      } catch (error) {
        console.error('Failed to fetch checklists', error);
      }
    };

    const loadLifeguardId = async () => {
      try {
        const lifeguardData = await fetchLifeguardId(userId);
        setLifeguardId(lifeguardData.id);
        const scheduleData = await fetchLifeguardSchedules(lifeguardData.id);
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Failed to fetch lifeguard data', error);
      }
    };

    loadChecklists();
    loadLifeguardId();
  }, [userId]);

  const loadRecordsBySchedule = async (scheduleId) => {
    try {
      const data = await fetchPeriodicCheckRecordsBySchedule(scheduleId);
      if (data.length > 0) {
        setRecords(data.map(record => ({
          id: record.id,
          check_item_id: record.check_item.id,
          value: record.value,
          pool: record.pool,
          remark: record.remark
        })));
        setIsUpdate(true); // 记录存在，进行更新操作
      } else {
        setRecords(checklistItems.map(item => ({ check_item_id: item.id, value: '', pool: '', remark: '' })));
        setIsUpdate(false); // 记录不存在，进行创建操作
      }
    } catch (error) {
      console.error('Failed to fetch records', error);
      setRecords(checklistItems.map(item => ({ check_item_id: item.id, value: '', pool: '', remark: '' })));
      setIsUpdate(false); // 加载失败，默认进行创建操作
    }
  };

  const handleScheduleSelect = (value) => {
    const selectedScheduleId = schedules[value].id;
    setSelectedSchedule(selectedScheduleId);
    loadRecordsBySchedule(selectedScheduleId);
  };

  const handleChange = (index, field, value) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      [field]: value,
    };
    setRecords(updatedRecords);
  };

  const handleSubmit = async () => {
    if (!selectedSchedule) {
      Alert.alert('提醒', '請選擇班表');
      return;
    }

    const formattedRecords = checklistItems.map((item, index) => {
      const record = records[index];
      if (record.pool !== '') {
        if (record.value === '') {
          Alert.alert('提醒', '請填寫數值紀錄');
          throw new Error('請填寫數值紀錄');
        }
      }
      return {
        id: record.id,
        check_item_id: item.id,
        value: record.value || '',
        pool: record.pool || '',
        duty: selectedSchedule,
        remark: record.remark || '',
      };
    });

    try {
      if (isUpdate) {
        await bulkUpdatePeriodicCheckRecords({ records: formattedRecords });
        Alert.alert('更新成功', '定時檢點表已更新');
      } else {
        await createPeriodicCheckRecord({ records: formattedRecords });
        Alert.alert('送出成功', '定時檢點表已送出');
      }
      router.back();
    } catch (error) {
      console.error('Failed to submit records', error);
      Alert.alert('送出失敗', '定時檢點表送出失敗');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {schedules && (
        <View style={styles.scheduleDropdownContainer}>
          <ModalDropdown
            options={schedules.map(schedule => `${schedule.date} - ${schedule.start_time} 到 ${schedule.end_time}`)}
            defaultValue="選擇班表"
            onSelect={handleScheduleSelect}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownTextStyle={styles.dropdownTextStyle}
          />
        </View>
      )}
      {checklistItems.map((item, index) => (
        <Card key={index}>
          <Card.Title style={styles.cardTitle}>{item.item}</Card.Title>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="水池名稱"
              value={records[index]?.pool}
              onChangeText={(value) => handleChange(index, 'pool', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="數值紀錄"
              value={records[index]?.value}
              onChangeText={(value) => handleChange(index, 'value', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="備註"
              value={records[index]?.remark}
              onChangeText={(value) => handleChange(index, 'remark', value)}
            />
          </View>
        </Card>
      ))}
      <Button
        title={isUpdate ? '更新' : '送出'}
        onPress={handleSubmit}
        color={COLORS.primary}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    marginBottom: 50,
  },
  scheduleDropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
  },
  dropdownTextStyle: {
    fontSize: SIZES.medium,
  },
  cardTitle: {
    textAlign: 'left',
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontFamily: FONT.bold,
  },
});

export default PeriodicChecklistScreen;
