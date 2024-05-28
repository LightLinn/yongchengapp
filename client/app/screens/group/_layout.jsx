import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="GroupListScreen"
        options={({ navigation }) => ({
          headerTitle: '角色管理',
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
        name="GroupUserListScreen"
        options={({ navigation }) => ({
          headerTitle: '角色列表',
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
        name="PermissionEditorScreen"
        options={({ navigation }) => ({
          headerTitle: '權限管理',
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