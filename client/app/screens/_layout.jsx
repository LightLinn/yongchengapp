import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { COLORS } from '../../styles/theme';

export default function Layout() {
  const router = useRouter();

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
              icon={<Icon name="home" color={COLORS.primary} />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => router.replace('/(tabs)/home')}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="group"
        options={({ navigation }) => ({
          headerTitle: '',
          headerShown: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.goBack()}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="repair"
        options={({ navigation }) => ({
          headerTitle: '',
          headerShown: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.goBack()}
            />
          ),
        })} 
      />
      <Stack.Screen 
        name="worklog"
        options={({ navigation }) => ({
          headerTitle: '',
          headerShown: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
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
          headerShown: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
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
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
      <Stack.Screen 
        name="venue"
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="course"
        options={{ 
          headerTitle: '課程管理',
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="attend"
        options={{ 
          headerTitle: '出勤管理',
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="schedule" 
        options={({ navigation }) => ({
          headerTitle: '排班管理',
          headerShadowVisible: false,
          headerShown: false,
          headerLeft: () => (
            <Button
              icon={<Icon name="arrow-back" color={COLORS.gray} />}
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.goBack()}
            />
          ),
        })} 
      />
      
    </Stack>
  )
}
