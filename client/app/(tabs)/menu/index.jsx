import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text } from 'react-native';
import { useRouter } from 'expo-router';
import SectionCard from '../../components/SectionCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { usePermissions } from '../../../context/PermissionsContext';
import { useAuth } from '../../../context/AuthContext';

const MenuScreen = () => {
  const router = useRouter();
  const { loading, refresh } = usePermissions();
  const { permissions } = useAuth();

  const onRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const hasPermission = (screenName, action) => {
    const permission = permissions.find(p => p.screen_name === screenName);
    return permission && permission[action];
  };

  const sections = [
    {
      title: '權限管理',
      screenName: '權限管理',
      features: [
        { name: '角色人員', icon: 'people', screenName: '角色人員', screen: '/screens/group/GroupListScreen', action: 'can_view' },
      ],
    },
    {
      title: '課程管理',
      screenName: '課程管理',
      features: [
        { name: '報名列表', icon: '', screenName: '報名列表', screen: '/screens/course/EnrollmentListScreen', action: 'can_view' },
        { name: '教練接課', icon: '', screenName: '教練接課', screen: '/screens/course/CoachAssignmentScreen', action: 'can_view' },
        { name: '簽到驗證', icon: '', screenName: '驗證QR code', screen: '/screens/attend/AttendQrcodeScreen', action: 'can_view' },
      ],
    },
    {
      title: '審核管理',
      screenName: '審核管理',
      features: [
        { name: '審核列表', icon: '', screenName: '審核列表', screen: '/screens/audit', action: 'can_view' },
      ],
    },
    {
      title: '場地管理',
      screenName: '場地管理',
      features: [
        { name: '場地列表', icon: '', screenName: '場地列表', screen: '/screens/venue/VenueScreen', action: 'can_view' },
        { name: '每日檢點', icon: '', screenName: '每日檢點', screen: '/screens/worklog/DailyChecklistScreen', action: 'can_view' },
        { name: '每日檢點總表', icon: '', screenName: '每日檢點總表', screen: '/screens/worklog/DailyCheckSummaryScreen', action: 'can_view' },
        { name: '定時巡檢', icon: '', screenName: '定時巡檢', screen: '/screens/worklog/DailyChecklistScreen', action: 'can_view' },
        { name: '定時巡檢總表', icon: '', screenName: '定時巡檢總表', screen: '/screens/worklog/DailyCheckSummaryScreen', action: 'can_view' },
        { name: '特殊處理', icon: '', screenName: '特殊處理', screen: '/screens/worklog/DailyChecklistScreen', action: 'can_view' },
        { name: '特殊處理總表', icon: '', screenName: '特殊處理總表', screen: '/screens/worklog/DailyCheckSummaryScreen', action: 'can_view' },
        { name: '日誌列表', icon: '', screenName: '日誌列表', screen: '/screens/worklog/WorklogScreen', action: 'can_view' },
        { name: '維修列表', icon: '', screenName: '維修列表', screen: '/screens/repair/RepairScreen', action: 'can_view' },
      ],
    },
    {
      title: '出勤管理',
      screenName: '出勤管理',
      features: [
        { name: '救生員簽到', icon: '', screenName: '救生員簽到', screen: '/screens/attend/LifeguardAttendScreen', action: 'can_view' },
        // { name: '救生員簽到紀錄', icon: '', screenName: '救生員簽到紀錄', screen: '/screens/attendance/view', action: 'can_view' },
        { name: '救生員班表', icon: '', screenName: '救生員班表', screen: '/screens/schedule/LifeguardSchedulesScreen', action: 'can_view' },
        { name: '創建救生員班表', icon: '', screenName: '創建救生員班表', screen: '/screens/schedule/view', action: 'can_view' },
        // { name: '救生員調班', icon: '', screenName: '救生員調班', screen: '/screens/reschedule/view', action: 'can_view' },
        // { name: '救生員請假', icon: '', screenName: '救生員請假', screen: '/screens/leave_request/view', action: 'can_view' },
        { name: '救生員排休', icon: '', screenName: '救生員排休', screen: '/screens/schedule/LifeguardUnavailableslotsScreen', action: 'can_view' },
        { name: '教練排課時段', icon: '', screenName: '教練排課時段', screen: '/screens/schedule/LocationSelectScreen', action: 'can_view' },
        { name: '教練課表', icon: '', screenName: '教練課表', screen: '/screens/schedule/CoachSchedulesScreen', action: 'can_view' },
      ],
    },
    {
      title: '消息管理',
      screenName: '消息管理',
      features: [
        { name: '消息列表', icon: '', screenName: '消息列表', screen: '/screens/news/NewsListScreen', action: 'can_view' },
      ],
    },
    {
      title: '通知管理',
      screenName: '通知管理',
      features: [
        { name: '通知列表', icon: '', screenName: '通知列表', screen: '/screens/notification/view', action: 'can_view' },
      ],
    },
  ];

  if (loading) {
    return (
      <View style={styles.noAccessContainer}>
        <Text style={styles.noAccessText}>您無訪問權限</Text>
      </View>
    );
  }

  

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {sections.map(section => (
          hasPermission(section.screenName, 'can_view') && (
            <SectionCard
              key={section.title}
              title={section.title}
              features={section.features.filter(feature => hasPermission(feature.screenName, feature.action))}
              onFeaturePress={screen => router.push(screen)}
            />
          )
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: COLORS.bg,
    marginBottom: 50,
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default MenuScreen;
