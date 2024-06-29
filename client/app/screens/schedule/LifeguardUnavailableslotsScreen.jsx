import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { COLORS, SIZES } from '../../../styles/theme';

const LifeguardUnavailableslotsScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [nextMonth, setNextMonth] = useState(moment().add(1, 'month').format('YYYY-MM'));

  useEffect(() => {
    const initializeNextMonth = moment().add(1, 'month').format('YYYY-MM');
    setNextMonth(initializeNextMonth);
  }, []);

  const handleDayPress = (day) => {
    const dateKey = day.dateString;

    if (!dateKey.startsWith(nextMonth)) {
      return;
    }

    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[dateKey]) {
      delete newSelectedDates[dateKey];
    } else {
      if (Object.keys(newSelectedDates).length < 4) {
        newSelectedDates[dateKey] = { selected: true, selectedColor: COLORS.primary };
      } else {
        Alert.alert('錯誤', '你只能選擇四個日期');
        return;
      }
    }
    setSelectedDates(newSelectedDates);
  };

  const handleSave = () => {
    if (Object.keys(selectedDates).length !== 4) {
      Alert.alert('錯誤', '請選擇四個日期');
      return;
    }
    // Save logic here
    Alert.alert('保存成功', '你的排休日期已保存');
  };

  const handleSubmit = () => {
    if (Object.keys(selectedDates).length !== 4) {
      Alert.alert('錯誤', '請選擇四個日期');
      return;
    }
    // Submit logic here
    Alert.alert('送出成功', '你的排休日期已送出');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>選擇次月排休日期</Text>
      <Calendar
        current={nextMonth}
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        theme={{
          selectedDayBackgroundColor: COLORS.primary,
          todayTextColor: COLORS.primary,
          arrowColor: COLORS.primary,
        }}
        minDate={moment().add(1, 'month').startOf('month').format('YYYY-MM-DD')}
        maxDate={moment().add(1, 'month').endOf('month').format('YYYY-MM-DD')}
        disableMonthChange={true}
        hideExtraDays={true}
      />
      <Text style={styles.selectedText}>
        已選擇 {Object.keys(selectedDates).length} / 4 個日期
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>送出</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectedText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default LifeguardUnavailableslotsScreen;
