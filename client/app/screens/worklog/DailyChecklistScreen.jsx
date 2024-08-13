import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Alert, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { fetchDailyChecklists, createDailyCheckRecord, bulkUpdateDailyCheckRecords, fetchDailyCheckRecordsBySchedule } from '../../../api/worklogApi';
import { fetchLifeguardId, fetchLifeguardSchedules } from '../../../api/scheduleApi';
import { useAuth } from '../../../context/AuthContext';
import { Card } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import { COLORS, FONT, SIZES } from '../../../styles/theme';
import { router } from 'expo-router';

const DailyChecklistScreen = () => {
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
        const data = await fetchDailyChecklists();
        setChecklistItems(data);
      } catch (error) {
        console.error('Failed to fetch checklists', error);
      }
    };

    const loadLifeguardId = async () => {
      try {
        const lifeguardData = await fetchLifeguardId(userId);
        setLifeguardId(lifeguardData.id);
        const scheduleData = await fetchLifeguardSchedules(lifeguardData.id, false);
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
      const data = await fetchDailyCheckRecordsBySchedule(scheduleId);
      if (data.length > 0) {
        setRecords(data.map(record => ({
          id: record.id,
          check_item_id: record.check_item.id,
          score: record.score,
          remark: record.remark
        })));
        setIsUpdate(true); // 记录存在，进行更新操作
      } else {
        setRecords(checklistItems.map(item => ({ check_item_id: item.id, score: '優良', remark: '' })));
        setIsUpdate(false); // 记录不存在，进行创建操作
      }
    } catch (error) {
      console.error('Failed to fetch records', error);
      setRecords(checklistItems.map(item => ({ check_item_id: item.id, score: '優良', remark: '' })));
      setIsUpdate(false); // 加载失败，默认进行创建操作
    }
  };

  const handleScheduleSelect = (value) => {
    const selectedScheduleId = schedules[value].id;
    setSelectedSchedule(selectedScheduleId);
    loadRecordsBySchedule(selectedScheduleId);
  };

  const handleScoreChange = (index, value) => {
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      score: value,
    };
    setRecords(updatedRecords);
  };

  const handleSubmit = async () => {
    if (!selectedSchedule) {
      Alert.alert('提醒', '請選擇班表');
      return;
    }

    const formattedRecords = records.map((record, index) => ({
      ...record,
      duty: selectedSchedule,
    }));

    try {
      if (isUpdate) {
        await bulkUpdateDailyCheckRecords({ records: formattedRecords });
        Alert.alert('更新成功', '每日檢點表已更新');
      } else {
        await createDailyCheckRecord({ records: formattedRecords });
        Alert.alert('提交成功', '每日檢點表已提交');
      }
      router.back();
    } catch (error) {
      console.error('Failed to submit records', error);
      Alert.alert('提交失敗', '每日檢點表提交失敗');
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
          <View style={styles.radioContainer}>
            <Text></Text>
            <RadioButton.Group
              onValueChange={(value) => handleScoreChange(index, value)}
              value={records[index]?.score || '優良'}
            >
              <View style={styles.radioButton}>
                <RadioButton value="優良" color={COLORS.primary} />
                <Text>優良</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="尚可" color={COLORS.primary} />
                <Text>尚可</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="需改善" color={COLORS.primary} />
                <Text>需改善</Text>
              </View>
            </RadioButton.Group>
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
    justifyContent: 'left',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
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

export default DailyChecklistScreen;
