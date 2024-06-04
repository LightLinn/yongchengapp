import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; // 使用 Expo 提供的圖標庫
import { COLORS, SIZES } from '../../styles/theme';

const SectionCard = ({ title, features, onFeaturePress }) => {
  return (
    <Card containerStyle={styles.card}>
      {/* <Text style={styles.title}>{title}</Text> */}
      {features.map((feature, index) => (
        <TouchableOpacity key={index} onPress={() => onFeaturePress(feature.screen)} style={styles.featureContainer}>
          <View style={styles.featureContent}>
            <Ionicons name={feature.icon} size={SIZES.medium} color={COLORS.gray3} style={styles.icon} />
            <Text style={styles.featureText}>{feature.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={SIZES.medium} color={COLORS.secondary} style={styles.arrowIcon} />
          {features.length > 1 && index < features.length - 1 && <Card.Divider style={styles.divider} />}
        </TouchableOpacity>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 5,
    borderRadius: 10,
    padding: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    color: COLORS.primary,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: SIZES.medium,
    color: COLORS.gray3,
    textAlign: 'left',
    marginLeft: 0,
  },
  icon: {
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 10,
  },
  divider: {
    backgroundColor: COLORS.gray2,
    height: 1,
  },
});

export default SectionCard;
