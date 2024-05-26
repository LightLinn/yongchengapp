// src/components/CourseCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

const CourseCard = ({ course }) => (
  <Card>
    <Card.Title>{course.name}</Card.Title>
    <Card.Divider />
    <Text>授課教練: {course.coach}</Text>
    <Text>上課地點: {course.location}</Text>
    <Text>已完成/總堂數: {course.completedSessions}/{course.totalSessions}</Text>
  </Card>
);

export default CourseCard;

const styles = StyleSheet.create({});
