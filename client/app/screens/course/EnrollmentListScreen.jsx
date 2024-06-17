import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, RefreshControl, Alert, Modal } from 'react-native';
import { fetchEnrollments, updateEnrollmentStatus, fetchEnrollmentDetails, fetchCourses } from '../../../api/enrollmentApi';
import EnrollmentItem from '../../components/EnrollmentItem';
import PaymentModal from '../../components/PaymentModal';
import ReviewModal from '../../components/ReviewModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import EnrollmentStopModal from '../../components/EnrollmentStopModal';
import EnrollmentCancelModal from '../../components/EnrollmentCancelModal';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EnrollmentListScreen = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [enrollmentViewModalVisible, setEnrollmentViewModalVisible] = useState(false);
  const [enrollmentStopModalVisible, setEnrollmentStopModalVisible] = useState(false);
  const [enrollmentCancelModalVisible, setEnrollmentCancelModalVisible] = useState(false);
  const [remark, setRemark] = useState('');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortAscending, setSortAscending] = useState(true);
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const enrollmentsData = await fetchEnrollments(userId);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handlePayment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setPaymentModalVisible(true);
  };

  const handleReview = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setReviewModalVisible(true);
  };

  const handleCancel = (enrollment) => {
    Alert.alert(
      '確認取消',
      '確定要取消這筆報名嗎？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => {
            setSelectedEnrollment(enrollment);
            setRemark('');
            setEnrollmentCancelModalVisible(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleStop = (enrollment) => {
    Alert.alert(
      '確認停課',
      '確定要停課這筆報名嗎？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => {
            setSelectedEnrollment(enrollment);
            setRemark('');
            setEnrollmentStopModalVisible(true);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleView = (enrollment) => {
    router.push(`/screens/course/EnrollmentDetailsScreen?enrollmentId=${enrollment.id}`);
  };

  const handleConfirmCancel = async () => {
    await updateEnrollmentStatus(selectedEnrollment.id, '已取消', null, null, `已取消 - ${remark}`);
    setEnrollmentCancelModalVisible(false);
    loadData();
  };

  const handleConfirmStop = async () => {
    await updateEnrollmentStatus(selectedEnrollment.id, '已停課', null, null, `已停課 - ${remark}`);
    setEnrollmentStopModalVisible(false);
    loadData();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const filteredEnrollments = enrollments.filter(enrollment => 
    (
      (enrollment.student && enrollment.student.includes(filter)) ||
      (enrollment.coursetype && enrollment.coursetype.name.includes(filter)) ||
      (enrollment.venue && enrollment.venue.name && enrollment.venue.name.includes(filter)) ||
      (enrollment.coach && enrollment.coach.user && enrollment.coach.user.nickname && enrollment.coach.user.nickname.includes(filter)) ||
      (enrollment.enrollment_number && enrollment.enrollment_number.name && enrollment.enrollment_number.name.includes(filter)) ||
      (enrollment.enrollment_status && enrollment.enrollment_status.includes(filter)) ||
      (enrollment.start_date && enrollment.start_date.includes(filter))
    ) &&
    (statusFilter ? enrollment.enrollment_status === statusFilter : true)
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={SIZES.xLarge} color={COLORS.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋"
          value={filter}
          onChangeText={setFilter}
        />
      </View>
      <ScrollView 
        horizontal 
        style={styles.statusFilterContainer}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => handleStatusFilter('')}>
          <Text style={[styles.statusFilter, !statusFilter && styles.activeFilter]}>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('待付款')}>
          <Text style={[styles.statusFilter, statusFilter === '待付款' && styles.activeFilter]}>待付款</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('審核中')}>
          <Text style={[styles.statusFilter, statusFilter === '審核中' && styles.activeFilter]}>審核中</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('進行中')}>
          <Text style={[styles.statusFilter, statusFilter === '進行中' && styles.activeFilter]}>進行中</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已完成')}>
          <Text style={[styles.statusFilter, statusFilter === '已完成' && styles.activeFilter]}>已完成</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已取消')}>
          <Text style={[styles.statusFilter, statusFilter === '已取消' && styles.activeFilter]}>已取消</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleStatusFilter('已停課')}>
          <Text style={[styles.statusFilter, statusFilter === '已停課' && styles.activeFilter]}>已停課</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredEnrollments.map((enrollment) => (
          <EnrollmentItem
            key={enrollment.id}
            enrollment={enrollment}
            onPayment={handlePayment}
            onReview={handleReview}
            onCancel={handleCancel}
            onStop={handleStop}
            onView={handleView}
          />
        ))}
      </ScrollView>
      {selectedEnrollment && (
        <PaymentModal
          visible={paymentModalVisible}
          enrollment={selectedEnrollment}
          onClose={() => setPaymentModalVisible(false)}
          onUpdate={() => loadData()}
        />
      )}
      {selectedEnrollment && (
        <ReviewModal
          visible={reviewModalVisible}
          enrollment={selectedEnrollment}
          onClose={() => setReviewModalVisible(false)}
          onUpdate={() => loadData()}
        />
      )}
      {selectedEnrollment && (
        <EnrollmentStopModal
          visible={enrollmentStopModalVisible}
          enrollment={selectedEnrollment}
          remark={remark}
          onRemarkChange={setRemark}
          onConfirmStop={handleConfirmStop}
          onClose={() => setEnrollmentStopModalVisible(false)}
        />
      )}
      {selectedEnrollment && (
        <EnrollmentCancelModal
          visible={enrollmentCancelModalVisible}
          enrollment={selectedEnrollment}
          remark={remark}
          onRemarkChange={setRemark}
          onConfirmCancel={handleConfirmCancel}
          onClose={() => setEnrollmentCancelModalVisible(false)}
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusFilter: {
    padding: 5,
    color: COLORS.gray2,
  },
  activeFilter: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default EnrollmentListScreen;
