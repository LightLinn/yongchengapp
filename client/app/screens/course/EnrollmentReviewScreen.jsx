import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { fetchEnrollmentDetails, updateEnrollment, fetchEnrollmentNumbers, createEnrollmentNumber } from '../../../api/enrollmentApi';
import { COLORS, SIZES } from '../../../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModalDropdown from 'react-native-modal-dropdown';
import moment from 'moment';

const EnrollmentReviewScreen = () => {
  const { enrollmentId } = useLocalSearchParams();
  const router = useRouter();
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentNumbers, setEnrollmentNumbers] = useState([]);
  const [newNumberModalVisible, setNewNumberModalVisible] = useState(false);
  const [newNumber, setNewNumber] = useState('');

  useEffect(() => {
    const loadEnrollmentDetails = async () => {
      try {
        const details = await fetchEnrollmentDetails(enrollmentId);
        setEnrollmentDetails({
          ...details,
          coursetype_id: details.coursetype?.id,
          user_id: details.user?.id,
          venue_id: details.venue?.id,
          coach_id: details.coach?.id,
          enrollment_number_id: details.enrollment_number?.id
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to load enrollment details', error);
        setLoading(false);
      }
    };

    const loadEnrollmentNumbers = async () => {
      try {
        const numbers = await fetchEnrollmentNumbers();
        setEnrollmentNumbers(numbers);
      } catch (error) {
        console.error('Failed to load enrollment numbers', error);
      }
    };

    loadEnrollmentDetails();
    loadEnrollmentNumbers();
  }, [enrollmentId]);

  const handleSaveAssign = async () => {
    try {
      await updateEnrollment(enrollmentId, {
        ...enrollmentDetails,
        coursetype: undefined, // Remove these from the payload
        user: undefined,
        venue: undefined,
        coach: undefined,
        enrollment_number: undefined,
      });
      Alert.alert('保存成功', '報名資料已成功保存');
      router.push(`/screens/course/EnrollmentAssignedCourseScreen?enrollmentId=${enrollmentId}`);
    } catch (error) {
      console.error('Failed to save enrollment', error);
      Alert.alert('保存失敗', '報名資料保存失敗');
    }
  };

  const handleSaveBack = async () => {
    try {
      await updateEnrollment(enrollmentId, {
        ...enrollmentDetails,
        coursetype: undefined, // Remove these from the payload
        user: undefined,
        venue: undefined,
        coach: undefined,
        enrollment_number: undefined,
      });
      Alert.alert('保存成功', '報名資料已成功保存');
      router.back();
    } catch (error) {
      console.error('Failed to save enrollment', error);
      Alert.alert('保存失敗', '報名資料保存失敗');
    }
  };

  const handleAddNewNumber = async () => {
    try {
      const newNumberData = await createEnrollmentNumber({ name: newNumber });
      setNewNumberModalVisible(false);
      setNewNumber('');
      const numbers = await fetchEnrollmentNumbers();
      setEnrollmentNumbers(numbers);
      setEnrollmentDetails({
        ...enrollmentDetails,
        enrollment_number_id: newNumberData.id,
        enrollment_number: newNumberData
      });
      Alert.alert('新增成功', '新的報名表單號已成功創建');
    } catch (error) {
      console.error('Failed to create enrollment number', error);
      Alert.alert('新增失敗', '創建失敗，報名表單號已存在');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>報名表單號</Text>
        <View style={styles.row}>
          <ModalDropdown
            options={enrollmentNumbers.map((num) => num.name)}
            defaultValue={enrollmentDetails.enrollment_number?.name || '選擇單號'}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownOptions}
            dropdownTextStyle={styles.dropdownOptionText}
            onSelect={(index, value) => {
              const selectedNumber = enrollmentNumbers[index];
              setEnrollmentDetails((prevState) => ({
                ...prevState,
                enrollment_number_id: selectedNumber.id,
                enrollment_number: selectedNumber,
              }));
            }}
          />
          <TouchableOpacity onPress={() => setNewNumberModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>新增</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>學生姓名</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.student}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, student: text })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>年齡</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.age ? enrollmentDetails.age.toString() : ''}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, age: text })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>開課日期</Text>
        <TextInput
          style={styles.input}
          value={moment(enrollmentDetails.start_date).format('YYYY-MM-DD')}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, start_date: text })}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>開課時間</Text>
        <TextInput
          style={styles.input}
          value={moment(enrollmentDetails.start_time, 'HH:mm:ss').format('HH:mm')}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, start_time: text })}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>程度描述</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.degree}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, degree: text })}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>課程類型</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.coursetype?.name}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, coursetype: { ...enrollmentDetails.coursetype, name: text } })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>場地</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.venue?.name}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, venue: { ...enrollmentDetails.venue, name: text } })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>報名狀態</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.enrollment_status}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, enrollment_status: text })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>付款方式</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.payment_method}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, payment_method: text })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>付款日期</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.payment_date}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, payment_date: text })}
          editable={false}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>備註</Text>
        <TextInput
          style={styles.input}
          value={enrollmentDetails.remark}
          onChangeText={(text) => setEnrollmentDetails({ ...enrollmentDetails, remark: text })}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSaveBack} style={styles.saveButton}>
          <Text style={styles.buttonText}>保存</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveAssign} style={styles.nextButton}>
          <Text style={styles.buttonText}>指派教練</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={newNumberModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新增報名表單號</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="輸入新單號"
              value={newNumber}
              onChangeText={setNewNumber}
            />
            <TouchableOpacity onPress={handleAddNewNumber} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>新增</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewNumberModalVisible(false)} style={styles.modalButtonCancel}>
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: COLORS.gray,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    flex: 1,
  },
  dropdownText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  dropdownOptions: {
    width: '80%',
    borderRadius: 5,
  },
  dropdownOptionText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default EnrollmentReviewScreen;
