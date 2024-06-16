import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { fetchEnrollments, updateEnrollmentStatus } from '../../../api/enrollmentApi';
import EnrollmentItem from '../../components/EnrollmentItem';
import PaymentModal from '../../components/PaymentModal';
import ReviewModal from '../../components/ReviewModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EnrollmentListScreen = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortAscending, setSortAscending] = useState(true);

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

  const handleSort = (field) => {
    const sortedData = [...enrollments].sort((a, b) => {
      if (field === 'created_at') {
        return sortAscending ? new Date(a[field]) - new Date(b[field]) : new Date(b[field]) - new Date(a[field]);
      }
      return 0;
    });
    setEnrollments(sortedData);
    setSortField(field);
    setSortAscending(!sortAscending);
    setShowSortMenu(false);
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
        {/* <TouchableOpacity onPress={() => setShowSortMenu(!showSortMenu)} style={styles.sortButton}>
          <Ionicons name="sort" size={SIZES.xLarge} color={COLORS.primary} />
        </TouchableOpacity> */}
      </View>
      {/* {showSortMenu && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity onPress={() => handleSort('start_date')}>
            <Text style={styles.dropdownMenuItem}>創建時間舊至新</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('start_date_desc')}>
            <Text style={styles.dropdownMenuItem}>創建時間新至舊</Text>
          </TouchableOpacity>
        </View>
      )} */}
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
        <TouchableOpacity onPress={() => handleStatusFilter('派課中')}>
          <Text style={[styles.statusFilter, statusFilter === '派課中' && styles.activeFilter]}>派課中</Text>
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
        <TouchableOpacity onPress={() => handleStatusFilter('已退款')}>
          <Text style={[styles.statusFilter, statusFilter === '已退款' && styles.activeFilter]}>已退款</Text>
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
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  sortButton: {
    padding: 10,
  },
  dropdownMenu: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 40,
    right: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  dropdownMenuItem: {
    padding: 5,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusFilter: {
    padding: 5,
    color: COLORS.gray2,
    marginHorizontal: 5,
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
