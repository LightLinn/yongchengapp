import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { updateAssignmentStatus } from '../../api/assignmentApi';
import { COLORS, SIZES } from '../../styles/theme';

const AssignmentDetailModal = ({ visible, assignment, onClose, onUpdate }) => {
  const handleStatusChange = async (status) => {
    try {
      await updateAssignmentStatus(assignment.id, status);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update assignment status:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>指派詳情</Text>
          <Text style={styles.details}>指派編號: {assignment.id}</Text>
          <Text style={styles.details}>狀態: {assignment.assigned_status}</Text>
          <TouchableOpacity onPress={() => handleStatusChange('已接受')} style={styles.button}>
            <Text style={styles.buttonText}>接受</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStatusChange('已拒絕')} style={styles.button}>
            <Text style={styles.buttonText}>拒絕</Text>
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
  details: {
    fontSize: SIZES.body3,
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

export default AssignmentDetailModal;
