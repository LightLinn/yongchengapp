import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="VenueScreen"
        options={({ navigation }) => ({
          headerTitle: '場地列表',
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
      <Stack.Screen 
        name="VenueFormScreen"
        options={({ navigation }) => ({
          headerTitle: '場地資訊',
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
    </Stack>
    
  )
}