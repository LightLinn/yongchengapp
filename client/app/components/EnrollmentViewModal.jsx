import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';
import { fetchEnrollmentDetails, fetchCourses } from '../../api/enrollmentApi';

const EnrollmentViewModal = ({ visible, enrollment, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (enrollment && enrollment.id) {
        try {
          const details = await fetchEnrollmentDetails(enrollment.id);
          setEnrollmentDetails(details);

          if (enrollment.enrollment_number && enrollment.enrollment_number.id) {
            const courseDetails = await fetchCourses(enrollment.enrollment_number.id, enrollment.enrollment_number.name);
            setCourses(courseDetails);
          }
        } catch (error) {
          console.error('Failed to load details', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (enrollment) {
      loadDetails();
    }
  }, [enrollment]);

  if (loading) {
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text>Loading...</Text>
            <TouchableOpacity onPress={onClose} style={styles.buttonClose}>
              <Text style={styles.buttonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.header}>報名詳細資料</Text>
            {enrollmentDetails && (
              <>
                <Text style={styles.details}>報名表編號: {enrollmentDetails.enrollment_number ? enrollmentDetails.enrollment_number.name : ''}</Text>
                <Text style={styles.details}>學生姓名: {enrollmentDetails.student}</Text>
                <Text style={styles.details}>開課日期: {enrollmentDetails.start_date ? enrollmentDetails.start_date : ''}</Text>
                <Text style={styles.details}>教練姓名: {enrollmentDetails.coach && enrollmentDetails.coach.user ? enrollmentDetails.coach.user.nickname : ''}</Text>
                <Text style={styles.details}>上課場地: {enrollmentDetails.venue ? enrollmentDetails.venue.name : ''}</Text>
              </>
            )}
            {courses && courses.length > 0 ? (
              <>
                <Text style={styles.header}>課程詳細資料</Text>
                {courses.map((course) => (
                  <View key={course.id} style={styles.courseItem}>
                    <Text style={styles.details}>課程名稱: {course.enrollment_list.coursetype.name}</Text>
                    <Text style={styles.details}>課程描述: {course.enrollment_list.coursetype.description}</Text>
                    <Text style={styles.details}>課程價格: {course.enrollment_list.coursetype.price}</Text>
                    <Text style={styles.details}>課程日期: {course.course_date}</Text>
                    <Text style={styles.details}>課程時間: {course.course_time}</Text>
                    <Text style={styles.details}>課程狀態: {course.course_status}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text>未找到課程詳細資料</Text>
            )}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.buttonClose}>
            <Text style={styles.buttonText}>關閉</Text>
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
    marginTop: 10,
  },
  details: {
    fontSize: SIZES.medium,
    marginBottom: 5,
  },
  courseItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 5,
  },
  buttonClose: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EnrollmentViewModal;
