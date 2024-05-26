import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="NewsDetailScreen"
        options={{ 
          headerTitle: '',
          headerShown: false,
        }} 
      />
      
    </Stack>
  )
}
