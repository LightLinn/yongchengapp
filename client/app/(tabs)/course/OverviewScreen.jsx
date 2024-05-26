import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import CourseCard from '../../components/CourseCard';
import { fetchCourses } from '../../../api/courseApi';

const OverviewScreen = () => {
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    };

    loadCourses();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </ScrollView>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
