import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OverviewScreen from './OverviewScreen';
import EnrollmentScreen from './EnrollmentScreen';
import AttendanceScreen from './AttendanceScreen';

const Tab = createMaterialTopTabNavigator();

const CourseLayout = () => {
  return (
    <Tab.Navigator>
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
