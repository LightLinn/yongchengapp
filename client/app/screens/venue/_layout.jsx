import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="VenueScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="VenueAddScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="detail/[id]"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      
    </Stack>
    
  )
}