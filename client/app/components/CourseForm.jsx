// src/components/CourseForm.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { submitRegistration, fetchLatestRegistration } from '../../api/courseApi';

const CourseForm = ({ isNewStudent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
  });

  useEffect(() => {
    if (!isNewStudent) {
      const loadLatestRegistration = async () => {
        const latestData = await fetchLatestRegistration();
        setFormData(latestData);
      };

      loadLatestRegistration();
    }
  }, [isNewStudent]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    await submitRegistration(formData);
    alert('提交成功');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="姓名"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="電子郵件"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="電話"
        value={formData.phone}
        onChangeText={(value) => handleChange('phone', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="課程"
        value={formData.course}
        onChangeText={(value) => handleChange('course', value)}
        style={styles.input}
      />
      <Button title="提交" onPress={handleSubmit} />
    </View>
  );
};

export default CourseForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
