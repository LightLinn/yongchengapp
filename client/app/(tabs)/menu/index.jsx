import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import SectionCard from '../../components/SectionCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, SIZES } from '../../../styles/theme';
import { usePermissions } from '../../../context/PermissionsContext';

const MenuScreen = () => {
  const router = useRouter();
  const { permissions, loading, refresh } = usePermissions();

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
      screenName: 'admin',
      features: [
        { name: '角色人員', icon: 'people', screenName: 'role_screen', screen: '/screens/group/GroupListScreen', action: 'can_view' },
      ],
    },
    {
      title: '課程管理',
      screenName: 'course',
      features: [
        { name: '報名列表', icon: 'clipboard', screenName: 'enrollmentlists_screen', screen: '/screens/course/EnrollmentListScreen', action: 'can_view' },
        { name: '教練接課', icon: 'document', screenName: 'take_course_screen', screen: '/screens/course/CoachAssignmentScreen', action: 'can_view' },
        { name: '簽到驗證', icon: 'checkbox', screenName: 'attend_qrcode_screen', screen: '/screens/course/AttendQrcodeScreen', action: 'can_view' },
      ],
    },
    {
      title: '審核管理',
      screenName: 'review',
      features: [
        { name: '審核列表', icon: 'checkmark-circle', screenName: 'review_screen', screen: '/screens/audit', action: 'can_view' },
      ],
    },
    {
      title: '場地管理',
      screenName: 'venue',
      features: [
        { name: '場地', icon: 'location', screenName: 'venue_screen', screen: '/screens/venue/VenueScreen', action: 'can_view' },
        { name: '日誌', icon: 'book', screenName: 'worklog_screen', screen: '/screens/worklog/WorklogScreen', action: 'can_view' },
        { name: '維修', icon: 'build', screenName: 'repair_screen', screen: '/screens/repair/RepairScreen', action: 'can_view' },
      ],
    },
    {
      title: '出勤管理',
      screenName: 'attendance',
      features: [
        { name: '出勤簽到', icon: 'time', screenName: 'checkin_screen', screen: '/screens/clockin/view', action: 'can_view' },
        { name: '出勤紀錄', icon: 'clipboard', screenName: 'checkin_record_screen', screen: '/screens/attendance/view', action: 'can_view' },
        { name: '救生員調班', icon: 'swap-horizontal', screenName: 'shift_schedule_screen', screen: '/screens/reschedule/view', action: 'can_view' },
        { name: '救生員請假', icon: 'calendar', screenName: 'askforleave_screen', screen: '/screens/leave_request/view', action: 'can_view' },
        { name: '救生員排休', icon: 'bed', screenName: 'lifeguard_schedule_screen', screen: '/screens/schedule/LifeguardUnavailableslotsScreen', action: 'can_view' },
        { name: '教練排班', icon: 'calendar', screenName: 'coach_schedule_screen', screen: '/screens/schedule/LocationSelectScreen', action: 'can_view' },
      ],
    },
    {
      title: '消息管理',
      screenName: 'news',
      features: [
        { name: '消息', icon: 'chatbubbles', screenName: 'news_screen', screen: '/screens/news/NewsListScreen', action: 'can_view' },
      ],
    },
    {
      title: '通知管理',
      screenName: 'notification',
      features: [
        { name: '通知', icon: 'notifications', screenName: 'notification_screen', screen: '/screens/notification/view', action: 'can_view' },
      ],
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
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
});

export default MenuScreen;
