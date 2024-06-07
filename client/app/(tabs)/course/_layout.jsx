import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OverviewScreen from './OverviewScreen';
import EnrollmentScreen from './EnrollmentScreen';
import AttendanceScreen from './AttendanceScreen';
import { COLORS, SIZES } from '../../../styles/theme';

const Tab = createMaterialTopTabNavigator();

const CourseLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: SIZES.medium }, // 修改字體大小
        tabBarIndicatorStyle: { backgroundColor: COLORS.secondary }, // 修改指示器顏色
        tabBarStyle: { backgroundColor: COLORS.white }, // 修改標籤背景顏色
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: '總覽' }}
      />
      <Tab.Screen
        name="Enrollment"
        component={EnrollmentScreen}
        options={{ title: '報名' }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: '簽到' }}
      />
    </Tab.Navigator>
  );
};

export default CourseLayout;
