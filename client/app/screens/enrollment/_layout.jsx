import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="EnrollmentAddScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="EnrollmentStatusScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
    </Stack>
    
  )
}