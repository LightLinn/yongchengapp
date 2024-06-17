import React from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

const EnrollmentModal = ({ visible, enrollment, remark, onRemarkChange, onConfirmCancel, onConfirmStop, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.details}>報名表編號 {enrollment.enrollment_number ? enrollment.enrollment_number.name : ''}</Text>
          <Text style={styles.details}>學生姓名 {enrollment.student}</Text>
          <Text style={styles.details}>開課日期 {enrollment.start_date ? enrollment.start_date : ''}</Text>
          <Text style={styles.details}>教練姓名 {enrollment.coach && enrollment.coach.user ? enrollment.coach.user.nickname : ''}</Text>
          <Text style={styles.details}>上課場地 {enrollment.venue ? enrollment.venue.name : ''}</Text>
          {/* Add more details if necessary */}
          <TextInput
            style={styles.remarkInput}
            placeholder="取消原因"
            value={remark}
            onChangeText={onRemarkChange}
          />
          <View style={styles.buttonContainer}> 
            <TouchableOpacity onPress={onConfirmCancel} style={styles.buttonStop}>
              <Text style={styles.buttonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.buttonClose}>
              <Text style={styles.buttonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStop: {
    backgroundColor: COLORS.alert,
    padding: 10,
    borderRadius: 10,
  },
  buttonClose: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EnrollmentModal;
