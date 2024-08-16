import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import { COLORS, SIZES } from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { leaveCourse, adjustCourse } from '../../api/courseApi';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseDetailItem = ({ enroll, course }) => {
  const navigation = useNavigation();
  const currentDate = new Date();
  const router = useRouter();
  currentDate.setHours(0, 0, 0, 0); // 將時間設置為午夜

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCoach, setIsCoach] = useState(false);

  const courseDate = new Date(course.course_date);
  courseDate.setHours(0, 0, 0, 0); // 將時間設置為午夜

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('groups');
      setIsCoach(role.includes("內部_教練")); // 检查角色是否包含"內部_教練"
    };
    checkRole();
  }, []);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
    handleAdjustRequest(date); // 傳遞選中的日期
  };

  const handleLeaveRequest = () => {
    Alert.alert(
      '確認請假',
      '確定要請假嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '確認', onPress: () => handleApiRequest('leave') },
      ]
    );
  };

  const handleAdjustRequest = (date) => {
    Alert.alert(
      '確認調課',
      `確定要將這門課程調至 ${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')} 嗎？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '確認', onPress: () => handleApiRequest('adjust', date) },
      ]
    );
  };

  const handleApiRequest = async (action, date) => {
    try {
      if (action === 'leave') {
        await leaveCourse(course.id);
      } else if (action === 'adjust') {
        const formattedDate = date.toISOString().split('T')[0]; // 格式化日期
        await adjustCourse(course.id, formattedDate);
      }
      Alert.alert('成功', '操作成功！');
      router.back();
    } catch (error) {
      console.error('Failed to perform action', error);
      Alert.alert('錯誤', error.message || '操作失敗');
    }
  };

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.titleDate}>{course.course_date}</Text>
          <Text style={styles.titleTime}>{course.course_time}</Text>
        </View>
        <Text style={styles.status}>{course.course_status || ''}</Text>
      </View>
      <Card.Divider style={styles.divider} />
      
      {course.course_status == '進行中' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button2} onPress={handleLeaveRequest}>
            <Text style={styles.buttonText}>請假</Text>
          </TouchableOpacity>
          {isCoach && ( 
            <TouchableOpacity style={styles.button2} onPress={showDatePicker}>
              <Text style={styles.buttonText}>調課</Text>
            </TouchableOpacity>
          )}
          
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 20,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  titleDate: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.success,
    padding: 3,
  },
  titleTime: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.secondary,
    padding: 3,
  },
  status: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: COLORS.gray2,
    height: 1,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button1: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button2: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
});

export default CourseDetailItem;
