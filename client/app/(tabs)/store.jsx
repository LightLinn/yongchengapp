import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONT } from '../../styles/theme';

const StoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text >近期開放</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
});

export default StoreScreen;
