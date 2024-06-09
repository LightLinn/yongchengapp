import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OverviewScreen from './OverviewScreen';
import EnrollmentScreen from './EnrollmentScreen';
import AttendanceScreen from './AttendanceScreen';
import { COLORS, SIZES } from '../../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const CourseLayout = () => {
  const [isCoach, setIsCoach] = useState(false);

  useEffect(() => {
    const checkIsCoach = async () => {
      const groups = await AsyncStorage.getItem('groups');
      if (groups) {
        setIsCoach(groups.includes('內部_教練'));
      }
    };

    checkIsCoach();
  }, []);

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
      {!isCoach && (
        <Tab.Screen
          name="Enrollment"
          component={EnrollmentScreen}
          options={{ title: '報名' }}
        />
      )}
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: '簽到' }}
      />
    </Tab.Navigator>
  );
};

export default CourseLayout;
