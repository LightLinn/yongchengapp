import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { COLORS, SIZES } from '../../../styles/theme';
import { createWorklog } from '../../../api/worklogApi'; // 假設有這個 API 函數

const CreateWorklogScreen = () => {
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!description || !venue) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    const worklogData = {
      description,
      venue,
      date: moment(date).format('YYYY-MM-DD'),
      start_time: moment(startTime).format('HH:mm:ss'),
      end_time: moment(endTime).format('HH:mm:ss'),
    };

    try {
      await createWorklog(worklogData);
      Alert.alert('成功', '工作日誌已創建');
      router.back();
    } catch (error) {
      console.error('Failed to create worklog', error);
      Alert.alert('錯誤', '創建工作日誌失敗');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>創建新工作日誌</Text>

      <Text style={styles.label}>描述</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="輸入工作描述"
        multiline
      />

      <Text style={styles.label}>地點</Text>
      <TextInput
        style={styles.input}
        value={venue}
        onChangeText={setVenue}
        placeholder="輸入工作地點"
      />

      <Text style={styles.label}>日期</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text>{moment(date).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>開始時間</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartTimePicker(true)}>
        <Text>{moment(startTime).format('HH:mm')}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onStartTimeChange}
        />
      )}

      <Text style={styles.label}>結束時間</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndTimePicker(true)}>
        <Text>{moment(endTime).format('HH:mm')}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onEndTimeChange}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>提交</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: SIZES.medium,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default CreateWorklogScreen;