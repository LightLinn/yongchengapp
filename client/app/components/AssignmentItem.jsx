import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

const AssignmentItem = ({ assignment, onDetail }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>指派編號: {assignment.id}</Text>
      <Text style={styles.details}>狀態: {assignment.assigned_status}</Text>
      <TouchableOpacity onPress={() => onDetail(assignment)} style={styles.button}>
        <Text style={styles.buttonText}>查看詳情</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  details: {
    fontSize: SIZES.body3,
    marginVertical: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AssignmentItem;
