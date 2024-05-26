import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="WelcomeScreen"
        options={{ 
          headerTitle: '',
          headerShadowVisible: false,
        }} 
      />
      <Stack.Screen 
        name="ProfileScreen" 
        options={({ navigation }) => ({
          headerTitle: '用戶管理',
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
        name="news" 
        options={({ navigation }) => ({
          headerTitle: '最新消息',
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
        name="notify" 
        options={({ navigation }) => ({
          headerTitle: '通知列表',
          headerShown: false,
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
        name="venue"
        options={{
          headerTitle: '場地管理',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen 
        name="enrollment"
        options={{ 
          headerTitle: '報名管理',
          headerShadowVisible: false,
        }}
      />
      
    </Stack>
  )
}
