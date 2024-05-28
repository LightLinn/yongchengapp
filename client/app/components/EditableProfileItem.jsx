import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const EditableProfileItem = ({ label, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      <Icon
        name={isEditing ? 'check' : 'edit'}
        type="feather"
        color={isEditing ? COLORS.success : COLORS.gray2 } 
        onPress={() => setIsEditing(!isEditing)}
        containerStyle={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  value: {
    flex: 2,
    fontSize: 16,
  },
  input: {
    flex: 2,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginLeft: 10,
  },
});

export default EditableProfileItem;
