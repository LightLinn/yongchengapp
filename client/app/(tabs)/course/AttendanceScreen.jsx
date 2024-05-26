
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { fetchTodayCourses, submitAttendance } from '../../../api/courseApi';
import QRScanner from '../../components/QRScanner';

const AttendanceScreen = () => {
  const [courses, setCourses] = useState([]);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const loadTodayCourses = async () => {
      const fetchedCourses = await fetchTodayCourses();
      setCourses(fetchedCourses);
    };

    loadTodayCourses();
  }, []);

  const handleScan = async (data) => {
    setScannedData(data);
  };

  const handleSubmit = async () => {
    if (scannedData) {
      await submitAttendance({ qrData: scannedData });
      alert('簽到成功');
    } else {
      alert('請先掃描QR碼');
    }
  };

  return (
    <View style={styles.container}>
      <Text>今日課程</Text>
      {courses.map((course) => (
        <Text key={course.id}>{course.name}</Text>
      ))}
      <QRScanner onScan={handleScan} />
      <Button title="提交簽到" onPress={handleSubmit} />
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
