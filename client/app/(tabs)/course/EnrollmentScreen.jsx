import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { fetchCourseTypes, fetchVenues, fetchLatestEnrollment, createEnrollment } from '../../../api/courseApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnrollmentScreen = () => {
  const [step, setStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState({
    student: '',
    enrollment_status: '待付款',
    status: 'pending',
    start_date: null,
    start_time: null,
    payment_date: null,
    payment_method: '現金',
    payment_amount: null,
    remark: '',
    degree: '',
    coursetype: '',
    user: '', 
    enrollment_number: '',
    venue: '',
    coach: ''
  });
  const [courseTypes, setCourseTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  const [latestEnrollment, setLatestEnrollment] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    const latest = await fetchLatestEnrollment();
    setLatestEnrollment(latest);
    setStep(2);
  };

  const handleInputChange = (name, value) => {
    setEnrollmentData({ ...enrollmentData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await createEnrollment(enrollmentData);
      alert('報名成功！');
      setStep(0);
    } catch (error) {
      alert('報名失敗，請重試');
      console.error(error);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  const timeOptions = Array.from({ length: 29 }, (_, index) => {
    const hours = Math.floor(index / 2) + 7;
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
            <Text style={styles.label}>學生姓名</Text>
            <TextInput
              style={styles.input}
              value={enrollmentData.student}
              onChangeText={(value) => handleInputChange('student', value)}
            />

            <Text style={styles.label}>課程類型</Text>
            <Picker
              selectedValue={enrollmentData.coursetype}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('coursetype', itemValue)}
            >
              {courseTypes.map((courseType) => (
                <Picker.Item key={courseType.id} label={courseType.name} value={courseType.id} />
              ))}
            </Picker>

            <Text style={styles.label}>開始上課日期</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={enrollmentData.start_date ? enrollmentData.start_date.toLocaleDateString() : ''}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={enrollmentData.start_date || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  handleInputChange('start_date', selectedDate || enrollmentData.start_date);
                }}
              />
            )}

            <Text style={styles.label}>上課時間</Text>
            <Picker
              selectedValue={enrollmentData.start_time}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('start_time', itemValue)}
            >
              {timeOptions.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>

            <Text style={styles.label}>場地</Text>
            <Picker
              selectedValue={enrollmentData.venue}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('venue', itemValue)}
            >
              {venues.map((venue) => (
                <Picker.Item key={venue.id} label={venue.name} value={venue.id} />
              ))}
            </Picker>

            <Text style={styles.label}>付款方式</Text>
            <Picker
              selectedValue={enrollmentData.payment_method}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('payment_method', itemValue)}
            >
              <Picker.Item label="現金" value="cash" />
            </Picker>

            <Text style={styles.label}>程度描述</Text>
            <TextInput
              style={styles.input}
              value={enrollmentData.degree}
              onChangeText={(value) => handleInputChange('degree', value)}
            />

            <Text style={styles.label}>備註</Text>
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
            <Text style={styles.label}>學生姓名</Text>
            <Text style={styles.text}>{latestEnrollment.student}</Text>

            <Text style={styles.label}>課程類型</Text>
            <Text style={styles.text}>{latestEnrollment.coursetype}</Text>

            <Text style={styles.label}>開始上課日期</Text>
            <Text style={styles.text}>{latestEnrollment.start_date}</Text>

            <Text style={styles.label}>上課時間</Text>
            <Text style={styles.text}>{latestEnrollment.start_time}</Text>

            <Text style={styles.label}>場地</Text>
            <Text style={styles.text}>{latestEnrollment.venue}</Text>

            <Text style={styles.label}>付款方式</Text>
            <Text style={styles.text}>{latestEnrollment.payment_method}</Text>

            <Text style={styles.label}>程度描述</Text>
            <Text style={styles.text}>{latestEnrollment.degree}</Text>

            <Text style={styles.label}>備註</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
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
    color: COLORS.primary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: SIZES.medium,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  text: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    marginBottom: 10,
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
});

export default EnrollmentScreen;
