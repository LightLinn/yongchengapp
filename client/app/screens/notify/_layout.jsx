import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
          name="NotifyScreen" 
          options={({ navigation }) => ({
            headerTitle: '通知列表',
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
          name="NotifyDetailScreen" 
          options={({ navigation }) => ({
            headerTitle: '',
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
