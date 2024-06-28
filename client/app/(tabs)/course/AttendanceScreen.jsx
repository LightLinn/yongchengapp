import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Text, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import QrCodeScanner from '../../components/QrCodeScanner';
import { fetchAttendanceRecords, createAttendance } from '../../../api/attendApi';
import { fetchEnrollments, fetchEnrollmentsCoach, fetchCourseDetails } from '../../../api/courseApi';
import AttendanceRecordItem from '../../components/AttendanceRecordItem';
import AttendanceItem from '../../components/AttendanceItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const AttendanceScreen = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showRecords, setShowRecords] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [todayCourses, setTodayCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  const checkIsCoach = async () => {
    const role = await AsyncStorage.getItem('groups');
    return role.includes("內部_教練");
  };

  const loadData = async () => {
    setLoading(true); // 開始加載數據
    try {
      const userId = await AsyncStorage.getItem('userId');
      const isCoach = await checkIsCoach();
      const enrollmentsData = isCoach ? await fetchEnrollmentsCoach() : await fetchEnrollments();
      // 獲取報名資料
      // const enrollmentsData = await fetchEnrollments(userId);
      setEnrollments(enrollmentsData);

      // 獲取課程資料
      const coursesData = await Promise.all(enrollmentsData.map(enrollment =>
        fetchCourseDetails(enrollment.id)
      ));
      setCourses(coursesData.flat());

      // 獲取簽到紀錄
      const records = await fetchAttendanceRecords();
      setAttendanceRecords(records);

      // 篩選當天的課程並排除有簽到紀錄的課程
      const today = new Date().toISOString().split('T')[0];
      const todayCoursesData = coursesData.flat().filter(course =>
        course.course_date === today && !records.some(record => record.course.id === course.id)
      );
      setTodayCourses(todayCoursesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [route.params]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleScan = (data) => {
    setScanResult(data);
    setIsScanning(false);
  };

  const handleSignIn = async (courseId) => {
    if (scanResult === '') {
      Alert.alert('訊息', '請先掃描驗證碼QR code');
      return;
    }

    try {
      await createAttendance({
        status: '自動批准',
        attend_status: '簽到',
        course_id: courseId,
        check_code: scanResult,
        check_note: '',
      });
      Alert.alert('訊息', '簽到成功');
      loadData(); 
    } catch (error) {
      console.error('Failed to create attendance:', error);
      Alert.alert('訊息', '簽到失敗');
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    return (
      record.course.enrollment_list.venue?.name.includes(searchText) ||
      record.course.enrollment_list.coach?.user.nickname.includes(searchText) ||
      record.created_at.includes(searchText) ||
      record.course.enrollment_list.enrollment_number?.includes(searchText) ||
      record.status.includes(searchText)
    );
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <QrCodeScanner onScan={handleScan} onClose={() => setIsScanning(false)} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
            <Text style={styles.scanButtonText}>掃描驗證碼QR code</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.scanResultInput}
            placeholder="簽到驗證碼"
            value={scanResult}
            editable={false}
            onFocus={() => setIsScanning(true)}
          />
          {todayCourses.map(course => (
            <AttendanceItem
              key={course.id}
              course={course}
              enroll={enrollments.find(enroll => enroll.id === course.enrollment_list_id)}
              onSignIn={() => handleSignIn(course.id)}
            />
          ))}
          <TouchableOpacity style={styles.toggleButton} onPress={() => setShowRecords(!showRecords)}>
            <Text style={styles.toggleButtonText}>{showRecords ? '隱藏簽到紀錄' : '顯示簽到紀錄'}</Text>
          </TouchableOpacity>
          {showRecords && (
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="搜尋簽到紀錄..."
                value={searchText}
                onChangeText={handleSearch}
              />
              {filteredRecords.map((record) => (
                <AttendanceRecordItem key={record.id} record={record} />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.bg,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  scanResultInput: {
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: COLORS.gray3,
    borderRadius: 30,
    padding: 15,
    marginHorizontal: 80,
    marginVertical: 15,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: SIZES.medium,
  },
  toggleButton: {
    backgroundColor: COLORS.gray,
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: SIZES.medium,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: SIZES.medium,
    color: COLORS.black,
  },
});

export default AttendanceScreen;
