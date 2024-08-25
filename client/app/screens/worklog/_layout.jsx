import { Stack } from 'expo-router';
import { Button, Icon } from 'react-native-elements';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="WorklogListScreen"
        options={({ navigation }) => ({
          headerTitle: '工作日誌總表',
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
        name="WorklogDetailScreen"
        options={({ navigation }) => ({
          headerTitle: '工作日誌',
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
        name="CreateWorklogScreen"
        options={({ navigation }) => ({
          headerTitle: '建立新日誌',
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
        name="VenueSelectScreen2"
        options={({ navigation }) => ({
          headerTitle: '選擇場地',
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
        name="DailyChecklistScreen"
        options={({ navigation }) => ({
          headerTitle: '每日檢點表',
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
        name="DailyRecordsScreen"
        options={({ navigation }) => ({
          headerTitle: '每日檢點總表',
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
        name="SpecialChecklistScreen"
        options={({ navigation }) => ({
          headerTitle: '特殊檢點表',
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
        name="SpecialRecordsScreen"
        options={({ navigation }) => ({
          headerTitle: '特殊檢點總表',
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
        name="PeriodicChecklistScreen"
        options={({ navigation }) => ({
          headerTitle: '定時檢點表',
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
        name="PeriodicRecordsScreen"
        options={({ navigation }) => ({
          headerTitle: '定時檢點總表',
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