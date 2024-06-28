import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fetchCourseTypes, fetchVenues, fetchLatestEnrollment, createEnrollment } from '../../../api/courseApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useNavigation } from '@react-navigation/native';

const EnrollmentScreen = () => {
  const navigation = useNavigation();
  const initialEnrollmentData = {
    student: '',
    enrollment_status: '待付款',
    status: '待審核',
    start_date: null,
    start_time: null,
    payment_date: null,
    payment_method: '現金',
    payment_amount: null,
    remark: '',
    degree: '',
    coursetype_id: '',
    user_id: null,
    enrollment_number_id: '',
    venue_id: '',
    coach_id: null,
    age: ''
  };

  const [step, setStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState(initialEnrollmentData);
  const [courseTypes, setCourseTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [latestEnrollment, setLatestEnrollment] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchedCourseTypes = await fetchCourseTypes();
      const fetchedVenues = await fetchVenues();
      setCourseTypes(fetchedCourseTypes);
      setVenues(fetchedVenues);
    };

    loadData();
  }, []);

  const handleNewEnrollment = () => {
    setStep(1);
  };

  const handleExistingEnrollment = async () => {
    try {
      const latest = await fetchLatestEnrollment();
      setLatestEnrollment(latest);
      setEnrollmentData({
        student: latest.student,
        enrollment_status: '待付款',
        status: '待審核',
        start_date: latest.start_date,
        start_time: latest.start_time,
        payment_date: latest.payment_date,
        payment_method: latest.payment_method,
        payment_amount: latest.payment_amount,
        remark: latest.remark,
        degree: latest.degree,
        coursetype_id: latest.coursetype.id,
        user_id: latest.user.id,
        enrollment_number_id: latest.enrollment_number ? latest.enrollment_number.id : '',
        venue_id: latest.venue.id,
        coach_id: latest.coach && latest.coach.id ? latest.coach.id : null,
        age: latest.age || ''
      });
      setStep(2);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("查無紀錄", "查無歷史報名紀錄");
      } else {
        Alert.alert("查詢失敗", "查詢歷史報名紀錄失敗，請重試");
        console.error(error);
      }
    }
  };

  const handleInputChange = (name, value) => {
    setEnrollmentData({ ...enrollmentData, [name]: value });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { name: 'student', label: '學生姓名' },
      { name: 'age', label: '年齡' },
      { name: 'coursetype_id', label: '課程類型' },
      { name: 'start_date', label: '開始上課日期' },
      { name: 'start_time', label: '上課時間' },
      { name: 'venue_id', label: '上課場地' },
      { name: 'degree', label: '程度描述' },
    ];

    for (const field of requiredFields) {
      if (!enrollmentData[field.name]) {
        Alert.alert('錯誤', `${field.label}為必填項目`);
        return;
      }
    }

    const formattedStartDate = enrollmentData.start_date ? new Date(enrollmentData.start_date).toISOString().split('T')[0] : null;
    const formattedPaymentDate = enrollmentData.payment_date ? new Date(enrollmentData.payment_date).toISOString().split('T')[0] : null;

    const dataToSubmit = {
      ...enrollmentData,
      start_date: formattedStartDate,
      payment_date: formattedPaymentDate,
      age: parseInt(enrollmentData.age, 10)
    };

    try {
      await createEnrollment(dataToSubmit);
      Alert.alert("報名成功！", '報名成功！');
      setEnrollmentData(initialEnrollmentData);
      setStep(0);
      navigation.navigate('Overview');
    } catch (error) {
      Alert.alert("報名失敗", '報名失敗，請重試');
      console.error(error);
    }
  };

  const handleBack = () => {
    setEnrollmentData(initialEnrollmentData);
    setStep(0);
  };

  const timeOptions = Array.from({ length: 33 }, (_, index) => {
    const hours = Math.floor(index / 2) + 6;
    const minutes = index % 2 === 0 ? '00' : '30';
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  });

  return (
    <View style={styles.container}>
      {step === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNewEnrollment}>
            <Text style={styles.buttonText}>新生報名</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleExistingEnrollment}>
            <Text style={styles.buttonText}>舊生續報</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Card containerStyle={styles.card}>
            <Text style={styles.label}>*<Text style={styles.required}>學生姓名</Text></Text>
            <TextInput
              style={styles.input}
              value={enrollmentData.student}
              onChangeText={(value) => handleInputChange('student', value)}
            />
            <View style={styles.section}>
              <Text style={styles.label}>*<Text style={styles.required}>年齡</Text></Text>
              <TextInput
                style={styles.input}
                value={enrollmentData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.label}>*<Text style={styles.required}>課程類型</Text></Text>
            <ModalDropdown
              options={courseTypes.map(courseType => courseType.name)}
              defaultValue={courseTypes.find(courseType => courseType.id === enrollmentData.coursetype_id)?.name || '請選擇'}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
              onSelect={(index, value) => handleInputChange('coursetype_id', courseTypes[index].id)}
            />

            <Text style={styles.label}>*<Text style={styles.required}>開始上課日期</Text></Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={enrollmentData.start_date ? enrollmentData.start_date : ''}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={showDatePicker}
              mode="date"
              onConfirm={(date) => {
                setShowDatePicker(false);
                setSelectedDate(date);
                handleInputChange('start_date', date.toISOString().split('T')[0]);
              }}
              onCancel={() => setShowDatePicker(false)}
            />

            <Text style={styles.label}>*<Text style={styles.required}>上課時間</Text></Text>
            <ModalDropdown
              options={timeOptions}
              defaultValue={enrollmentData.start_time || '請選擇'}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
              onSelect={(index, value) => handleInputChange('start_time', value)}
            />

            <Text style={styles.label}>*<Text style={styles.required}>上課場地</Text></Text>
            <ModalDropdown
              options={venues.map(venue => venue.name)}
              defaultValue={venues.find(venue => venue.id === enrollmentData.venue_id)?.name || '請選擇'}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
              onSelect={(index, value) => handleInputChange('venue_id', venues[index].id)}
            />

            <Text style={styles.label}>*<Text style={styles.required}>程度描述</Text></Text>
            <TextInput
              style={styles.input}
              value={enrollmentData.degree}
              onChangeText={(value) => handleInputChange('degree', value)}
            />

            <Text style={styles.label}><Text style={styles.required}>付款方式</Text></Text>
            <ModalDropdown
              options={['現金']}
              defaultValue={enrollmentData.payment_method}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
              onSelect={(index, value) => handleInputChange('payment_method', value)}
            />

            <Text style={styles.label}><Text style={styles.required}>備註</Text></Text>
            <TextInput
              style={styles.input}
              value={enrollmentData.remark}
              onChangeText={(value) => handleInputChange('remark', value)}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>送出</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>離開</Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      )}

      {step === 2 && latestEnrollment && (
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Card containerStyle={styles.card}>
            <Text style={styles.label}><Text style={styles.required}>學生姓名</Text></Text>
            <Text style={styles.text}>{latestEnrollment.student}</Text>

            <Text style={styles.label}><Text style={styles.required}>年齡</Text></Text>
            <Text style={styles.text}>{latestEnrollment.age}</Text>

            <Text style={styles.label}><Text style={styles.required}>課程類型</Text></Text>
            <Text style={styles.text}>{latestEnrollment.coursetype.name}</Text>

            <Text style={styles.label}><Text style={styles.required}>開始上課日期</Text></Text>
            <Text style={styles.text}>{latestEnrollment.start_date}</Text>

            <Text style={styles.label}><Text style={styles.required}>上課時間</Text></Text>
            <Text style={styles.text}>{latestEnrollment.start_time}</Text>

            <Text style={styles.label}><Text style={styles.required}>上課場地</Text></Text>
            <Text style={styles.text}>{latestEnrollment.venue.name}</Text>

            <Text style={styles.label}><Text style={styles.required}>程度描述</Text></Text>
            <Text style={styles.text}>{latestEnrollment.degree}</Text>

            <Text style={styles.label}><Text style={styles.required}>付款方式</Text></Text>
            <Text style={styles.text}>{latestEnrollment.payment_method}</Text>

            <Text style={styles.label}><Text style={styles.required}>備註</Text></Text>
            <Text style={styles.text}>{latestEnrollment.remark}</Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>送出</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>離開</Text>
            </TouchableOpacity>
          </Card>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
  },
  formContainer: {
    paddingVertical: 10,
  },
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
  label: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.alert,
    marginBottom: 10,
  },
  required: {
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 10,
    marginTop: 0,
    marginBottom: 30,
    fontSize: SIZES.medium,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 30,
  },
  dropdownText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  dropdownOptions: {
    width: '70%',
    borderRadius: 5,
    marginTop: 15,
  },
  dropdownOptionText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  backButton: {
    backgroundColor: COLORS.gray2,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    paddingLeft: 5,
    marginBottom: 15,
  },
});

export default EnrollmentScreen;
