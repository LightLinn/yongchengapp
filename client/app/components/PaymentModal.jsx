import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { updateEnrollmentStatus } from '../../api/enrollmentApi';
import { COLORS, SIZES } from '../../styles/theme';
import moment from 'moment';

const PaymentModal = ({ visible, enrollment, onClose, onUpdate }) => {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    if (!amount) {
      Alert.alert('錯誤', '請輸入金額');
      return;
    }

    try {
      const paymentDate = moment().format('YYYY-MM-DD');
      await updateEnrollmentStatus(
        enrollment.id, 
        '審核中', 
        amount, 
        '現金', 
        enrollment.remark, 
        enrollment.coach, 
        paymentDate
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert('錯誤', '付款失敗');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>付款</Text>
          <TextInput
            style={styles.input}
            placeholder="輸入金額"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={handlePayment} style={styles.button}>
            <Text style={styles.buttonText}>確認付款</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.buttonText}>取消</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default PaymentModal;
