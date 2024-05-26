import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchCourses, fetchLatestRegistration, submitRegistration } from '../../../api/courseApi';

const EnrollmentAddScreen = () => {
  const [registrationData, setRegistrationData] = useState({
    courseType: '',
    studentName: '',
    startDate: new Date(),
    levelDescription: '',
    paymentAmount: '',
    paymentMethod: '',
    classCount: '',
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const { type } = useLocalSearchParams();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    const loadLatestRegistration = async () => {
      try {
        const latestRegistration = await fetchLatestRegistration();
        setRegistrationData(latestRegistration);
      } catch (error) {
        console.error('Failed to load latest registration', error);
      }
    };

    if (type === 'existing') {
      loadLatestRegistration();
    }

    loadCourses();
  }, [type]);

  const handleInputChange = (name, value) => {
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setRegistrationData({ ...registrationData, startDate: selectedDate });
    }
  };

  const handleSubmit = async () => {
    try {
      await submitRegistration(registrationData);
      alert('報名成功');
      router.back();
    } catch (error) {
      console.error('Failed to submit registration', error);
      alert('報名失敗');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        label="課程類型"
        value={registrationData.courseType}
        onChangeText={(value) => handleInputChange('courseType', value)}
      />
      <Input
        label="學生名稱"
        value={registrationData.studentName}
        onChangeText={(value) => handleInputChange('studentName', value)}
      />
      <Input
        label="開始上課日期"
        value={registrationData.startDate.toDateString()}
        onFocus={() => setDatePickerVisible(true)}
      />
      {isDatePickerVisible && (
        <DateTimePicker
          value={registrationData.startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Input
        label="程度描述"
        value={registrationData.levelDescription}
        onChangeText={(value) => handleInputChange('levelDescription', value)}
      />
      <Input
        label="付款金額"
        value={registrationData.paymentAmount}
        onChangeText={(value) => handleInputChange('paymentAmount', value)}
      />
      <Input
        label="付款方式"
        value={registrationData.paymentMethod}
        onChangeText={(value) => handleInputChange('paymentMethod', value)}
      />
      <Input
        label="課堂數量"
        value={registrationData.classCount}
        onChangeText={(value) => handleInputChange('classCount', value)}
      />
      <Button
        title="確認送出"
        onPress={handleSubmit}
        buttonStyle={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2089dc',
  },
});

export default EnrollmentAddScreen;
