import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { fetchCourseTypes, fetchVenues, fetchLatestEnrollment, createEnrollment } from '../../../api/courseApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const EnrollmentScreen = () => {
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
    coach_id: null
  };

  const [step, setStep] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState(initialEnrollmentData);
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
      coach_id: latest.coach && latest.coach.id ? latest.coach.id : null
    });
    setStep(2);
  };

  const handleInputChange = (name, value) => {
    setEnrollmentData({ ...enrollmentData, [name]: value });
  };

  const handleSubmit = async () => {
    const formattedStartDate = enrollmentData.start_date ? new Date(enrollmentData.start_date).toISOString().split('T')[0] : null;
    const formattedPaymentDate = enrollmentData.payment_date ? new Date(enrollmentData.payment_date).toISOString().split('T')[0] : null;

    const dataToSubmit = {
      ...enrollmentData,
      start_date: formattedStartDate,
      payment_date: formattedPaymentDate
    };

    console.log(dataToSubmit);
    try {
      await createEnrollment(dataToSubmit);
      alert('報名成功！');
      setEnrollmentData(initialEnrollmentData);
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
              selectedValue={enrollmentData.coursetype_id}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('coursetype_id', itemValue)}
            >
              <Picker.Item label="請選擇" value={null} />
              {courseTypes.map((courseType) => (
                <Picker.Item key={courseType.id} label={courseType.name} value={courseType.id} />
              ))}
            </Picker>

            <Text style={styles.label}>開始上課日期</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={enrollmentData.start_date ? enrollmentData.start_date : ''}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={enrollmentData.start_date ? new Date(enrollmentData.start_date) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  handleInputChange('start_date', selectedDate.toISOString().split('T')[0]);
                }}
              />
            )}

            <Text style={styles.label}>上課時間</Text>
            <Picker
              selectedValue={enrollmentData.start_time}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('start_time', itemValue)}
            >
              <Picker.Item label="請選擇" value={null} />
              {timeOptions.map((time) => (
                <Picker.Item key={time} label={time} value={time} />
              ))}
            </Picker>

            <Text style={styles.label}>場地</Text>
            <Picker
              selectedValue={enrollmentData.venue_id}
              style={styles.picker}
              onValueChange={(itemValue) => handleInputChange('venue_id', itemValue)}
            >
              <Picker.Item label="請選擇" value={null} />
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
              <Picker.Item label="請選擇" value={null} />
              <Picker.Item label="現金" value="現金" />
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
            <Text style={styles.text}>{latestEnrollment.coursetype.name}</Text>

            <Text style={styles.label}>開始上課日期</Text>
            <Text style={styles.text}>{latestEnrollment.start_date}</Text>

            <Text style={styles.label}>上課時間</Text>
            <Text style={styles.text}>{latestEnrollment.start_time}</Text>

            <Text style={styles.label}>場地</Text>
            <Text style={styles.text}>{latestEnrollment.venue.name}</Text>

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
    backgroundColor: COLORS.bg,
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
    marginBottom: 10,
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
  picker: {
    height: 150,
    width: '100%',
    marginBottom: 50,
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
