import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text>近期開放</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreScreen;
