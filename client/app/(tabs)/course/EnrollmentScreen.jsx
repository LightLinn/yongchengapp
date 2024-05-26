import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useRouter } from 'expo-router';

const EnrollmentScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="新生報名"
        onPress={() => router.push('/screens/enrollment/EnrollmentAddScreen?type=new')}
        buttonStyle={styles.button}
      />
      <Button
        title="舊生續報"
        onPress={() => router.push('/screens/enrollment/EnrollmentAddScreen?type=existing')}
        buttonStyle={styles.button}
      />
      <Button
        title="紀錄查詢"
        onPress={() => router.push('/screens/enrollment/EnrollmentStatusScreen')}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 20,
    width: '100%',
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: '#2089dc',
  },
});

export default EnrollmentScreen;
