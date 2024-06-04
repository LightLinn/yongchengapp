import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { fetchUserPermissions } from '../../../api/groupApi'; // 假設您已經設置好這個API
import SectionCard from '../../components/SectionCard';

const MenuScreen = () => {
  const router = useRouter();
  const { isLogging, groupIds } = useAuth(); // 獲取當前使用者信息
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const userPermissions = await fetchUserPermissions(groupIds); // 傳入使用者的群組名稱
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Failed to load permissions', error);
      }
    };

    if (groupIds && groupIds.length > 0) {
      loadPermissions();
    }
  }, [groupIds]);

  const hasPermission = (screenName, action) => {
    const permission = permissions.find(p => p.screen_name.screen_name === screenName);
    return permission && permission[action];
  };

  const sections = [
    {
      title: '後台管理',
      screenName: 'admin_screen', // 改成驗證admin
      features: [
        { name: '角色', icon: 'people', screenName: 'admin_screen', screen: '/screens/group/GroupListScreen', action: 'can_view' },
        { name: '人員', icon: 'person', screenName: 'admin_screen', screen: '/screens/roster/view', action: 'can_view' },
        { name: '創建課程', icon: 'school', screenName: 'admin_screen', screen: '/screens/course/CreateCourseScreen', action: 'can_create' },
      ],
    },
    {
      title: '審核管理',
      screenName: 'review_screen', // 改成驗證review
      features: [
        { name: '審核', icon: 'checkmark-circle', screenName: 'review_screen', screen: '/screens/audit', action: 'can_view' },
      ],
    },
    {
      title: '場地管理',
      screenName: 'venue_screen', // 改成驗證venue
      features: [
        { name: '場地', icon: 'location', screenName: 'venue_screen', screen: '/screens/venue/VenueScreen', action: 'can_view' },
        { name: '日誌', icon: 'book', screenName: 'worklog_screen', screen: '/screens/worklog/WorklogScreen', action: 'can_view' },
        { name: '維修', icon: 'build', screenName: 'repair_screen', screen: '/screens/repair/RepairScreen', action: 'can_view' },
      ],
    },
    {
      title: '出勤管理',
      screenName: 'attendance_screen', // 改成驗證attendance
      features: [
        { name: '打卡', icon: 'time', screenName: 'attendance_screen', screen: '/screens/clockin/view', action: 'can_view' },
        { name: '紀錄', icon: 'clipboard', screenName: 'attendance_screen', screen: '/screens/attendance/view', action: 'can_view' },
        { name: '調班', icon: 'swap-horizontal', screenName: 'attendance_screen', screen: '/screens/reschedule/view', action: 'can_view' },
        { name: '請假', icon: 'calendar', screenName: 'attendance_screen', screen: '/screens/leave_request/view', action: 'can_view' },
        { name: '排休', icon: 'bed', screenName: 'attendance_screen', screen: '/screens/leave/view', action: 'can_view' },
        { name: '排班', icon: 'calendar', screenName: 'attendance_screen', screen: '/screens/scheduling/view', action: 'can_view' },
      ],
    },
    {
      title: '消息管理',
      screenName: 'news_screen', // 改成驗證news
      features: [
        { name: '消息', icon: 'chatbubbles', screenName: 'news_screen', screen: '/screens/news/view', action: 'can_view' },
      ],
    },
    {
      title: '通知管理',
      screenName: 'notification_screen', // 改成驗證notification
      features: [
        { name: '通知', icon: 'notifications', screenName: 'notification_screen', screen: '/screens/notification/view', action: 'can_view' },
      ],
    },
  ];

  const handleFeaturePress = (screen) => {
    router.push(screen);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {sections.map(section => (
          isLogging && hasPermission(section.screenName, 'can_view') && (
            <SectionCard
              key={section.title}
              title={section.title}
              features={section.features.filter(feature => hasPermission(feature.screenName, feature.action))}
              onFeaturePress={handleFeaturePress}
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
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
    marginBottom: 50,
  },
});

export default MenuScreen;
