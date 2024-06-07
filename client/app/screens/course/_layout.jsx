import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="CourseDetailScreen"
        options={({ navigation }) => ({
          headerTitle: '課程資訊',
          headerShadowVisible: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color="#333" />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.goBack()}
            />
          ),
        })} 
      />
      {/* <Stack.Screen 
        name="AttendDetailScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      /> */}
    </Stack>
    
  )
}