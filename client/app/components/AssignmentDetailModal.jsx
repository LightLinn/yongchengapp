import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

const AssignmentDetailModal = ({ visible, assignment, enrollmentDetails, onClose, onAccept, onReject }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>指派詳情</Text>
            <Text style={styles.label}>指派編號: {assignment.id}</Text>
            <Text style={styles.label}>狀態: {assignment.assigned_status}</Text>
            <Text style={styles.label}>指派時間: {assignment.assigned_time}</Text>
            <Text style={styles.label}>截止時間: {assignment.deadline}</Text>
            {enrollmentDetails && (
              <>
                <Text style={styles.label}>報名單編號: {enrollmentDetails.enrollment_number}</Text>
                <Text style={styles.label}>課程類型: {enrollmentDetails.coursetype.name}</Text>
                <Text style={styles.label}>學生姓名: {enrollmentDetails.student}</Text>
                <Text style={styles.label}>日期: {enrollmentDetails.start_date}</Text>
                <Text style={styles.label}>時間: {enrollmentDetails.start_time}</Text>
                <Text style={styles.label}>地點: {enrollmentDetails.venue.name}</Text>
                <Text style={styles.label}>程度: {enrollmentDetails.degree}</Text>
                <Text style={styles.label}>年齡: {enrollmentDetails.age}</Text>
              </>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
                <Text style={styles.buttonText}>接受</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReject} style={styles.rejectButton}>
                <Text style={styles.buttonText}>拒絕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.buttonText}>關閉</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: SIZES.body3,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  rejectButton: {
    backgroundColor: COLORS.alert,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AssignmentDetailModal;
