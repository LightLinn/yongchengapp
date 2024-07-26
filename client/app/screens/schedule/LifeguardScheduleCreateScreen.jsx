import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchLifeguards, createLifeguardSchedule } from '../../../api/scheduleApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ModalDropdown from 'react-native-modal-dropdown';
import { COLORS, SIZES } from '../../../styles/theme';

const LifeguardScheduleCreateScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [lifeguards, setLifeguards] = useState([]);
  const [selectedLifeguard, setSelectedLifeguard] = useState(null);
  const router = useRouter();
  const { venueId, venueName } = useLocalSearchParams();

  const nextMonth = moment().add(1, 'month');
  const nextMonthString = nextMonth.format('YYYY-MM');
  const nextMonthName = nextMonth.format('MMMM YYYY');

  const timeOptions = Array.from({ length: 37 }, (_, i) => {
    const hour = Math.floor(i / 2) + 5;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  useEffect(() => {
    const fetchAllLifeguards = async () => {
      setLoading(true);
      try {
        const lifeguardsData = await fetchLifeguards();
        setLifeguards(lifeguardsData);
      } catch (error) {
        console.error('Failed to fetch lifeguards', error);
        Alert.alert('失敗', '無法加載救生員列表');
      } finally {
        setLoading(false);
      }
    };
    fetchAllLifeguards();
  }, []);

  const handleDayPress = (day) => {
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[day.dateString]) {
      delete newSelectedDates[day.dateString];
    } else {
      newSelectedDates[day.dateString] = { selected: true, marked: true, selectedColor: COLORS.primary };
    }
    setSelectedDates(newSelectedDates);
  };

  const selectDates = (type) => {
    const startOfMonth = moment(nextMonthString).startOf('month');
    const endOfMonth = moment(nextMonthString).endOf('month');
    const newSelectedDates = {};

    let currentDate = startOfMonth.clone();
    while (currentDate.isSameOrBefore(endOfMonth)) {
      const dateString = currentDate.format('YYYY-MM-DD');
      const dayOfWeek = currentDate.day();

      if (
        type === 'all' ||
        (type === 'weekend' && (dayOfWeek === 0 || dayOfWeek === 6)) ||
        (type === 'weekday' && dayOfWeek !== 0 && dayOfWeek !== 6) ||
        (type === 'exceptMonday' && dayOfWeek !== 1)
      ) {
        newSelectedDates[dateString] = { selected: true, marked: true, selectedColor: COLORS.primary };
      }

      currentDate.add(1, 'day');
    }

    setSelectedDates(newSelectedDates);
  };

  const clearSelection = () => {
    setSelectedDates({});
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedDates).length === 0 || !startTime || !endTime || !selectedLifeguard) {
      Alert.alert('錯誤', '請填寫所有字段');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('錯誤', '結束時間不可以早於開始時間');
      return;
    }

    setLoading(true);

    try {
      const scheduleData = {
        schedules: Object.keys(selectedDates).map(date => ({
          date,
          start_time: startTime,
          end_time: endTime,
          lifeguard: selectedLifeguard,
          venue: Number(venueId),
          status: '待審核',
        })),
      };
      await createLifeguardSchedule(scheduleData);
      Alert.alert('成功', '排班計劃已創建');
      router.back();
    } catch (error) {
      console.error('Failed to create schedule', error);
      let errorMessage = '無法創建排班計劃';
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage += `: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        console.error('Error request:', error.request);
        errorMessage += ': 服務器無響應';
      } else {
        console.error('Error message:', error.message);
        errorMessage += `: ${error.message}`;
      }
      Alert.alert('失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{venueName} - {nextMonthName}</Text>
      <Calendar
        current={nextMonthString}
        minDate={moment(nextMonthString).startOf('month').format('YYYY-MM-DD')}
        maxDate={moment(nextMonthString).endOf('month').format('YYYY-MM-DD')}
        onDayPress={handleDayPress}
        markedDates={selectedDates}
        monthFormat={'yyyy MM'}
        hideArrows={true}
        hideExtraDays={true}
        disableMonthChange={true}
      />
      <View style={styles.buttonContainer}>
        <CustomButton title="選擇平日" onPress={() => selectDates('weekday')} />
        <CustomButton title="選擇假日" onPress={() => selectDates('weekend')} />
        <CustomButton title="週一除外" onPress={() => selectDates('exceptMonday')} />
        <CustomButton title="選擇全部" onPress={() => selectDates('all')} />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton2 title="清除選擇" onPress={clearSelection} />
      </View>
      <View style={styles.buttonContainer}>
      </View>
      <View style={styles.dropdownContainer}>
        <ModalDropdown
          options={lifeguards.map(lg => `${lg.user.username || ''} ${lg.user.fullname || ''} ${lg.user.nickname || ''}`)}
          onSelect={(index, value) => setSelectedLifeguard(lifeguards[index].user.id)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownList}
          dropdownTextStyle={styles.dropdownListText}
          dropdownTextHighlightStyle={styles.dropdownTextHighlight}
          disabled={!lifeguards.length}
          defaultValue="選擇救生員"
        />
      </View>
      <View style={styles.inputContainer}>
        <ModalDropdown
          options={timeOptions}
          onSelect={(index, value) => setStartTime(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownList}
          dropdownTextStyle={styles.dropdownListText}
          dropdownTextHighlightStyle={styles.dropdownTextHighlight}
          defaultValue="開始時間"
        />
        <ModalDropdown
          options={timeOptions}
          onSelect={(index, value) => setEndTime(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownList}
          dropdownTextStyle={styles.dropdownListText}
          dropdownTextHighlightStyle={styles.dropdownTextHighlight}
          defaultValue="結束時間"
        />
      </View>
      <CustomButton3 title="確認排班" onPress={handleSubmit} />
    </ScrollView>
  );
};

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const CustomButton2 = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button2} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const CustomButton3 = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button3} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 5,
  },
  button2: {
    backgroundColor: COLORS.gray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 5,
  },
  button3: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.lightWhite,
    fontSize: SIZES.small,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginVertical: 0,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  dropdownList: {
    borderWidth: 1,
    borderRadius: 5,
    width: '70%',
  },
  dropdownListText: {
    fontSize: SIZES.medium,
    textAlign: 'center',
    paddingVertical: 10,
  },
  dropdownTextHighlight: {
    color: COLORS.lightWhite,
  },
});

export default LifeguardScheduleCreateScreen;