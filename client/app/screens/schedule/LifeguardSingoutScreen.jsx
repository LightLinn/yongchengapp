import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../../styles/theme';
import { fetchWorklogStatus, submitWorklog } from '../../../api/worklogApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const LifeguardSingoutScreen = () => {
  const { scheduleId } = useLocalSearchParams();
  const [worklogData, setWorklogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [usageCount, setUsageCount] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadWorklogStatus();
  }, []);

  const loadWorklogStatus = async () => {
    try {
      const data = await fetchWorklogStatus(scheduleId);
      setWorklogData(data);
    } catch (error) {
      console.error('Failed to load worklog status', error);
      Alert.alert('錯誤', '無法加載工作日誌狀態');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWorklogStatus();
  };

  const handleSubmitWorklog = async () => {
    // 驗證「描述」是否為空
    if (!description.trim()) {
      Alert.alert('錯誤', '請填寫描述。');
      return;
    }

    // 驗證「使用人數」是否為正整數
    const usageCountInt = parseInt(usageCount, 10);
    if (!usageCount || isNaN(usageCountInt) || usageCountInt <= 0) {
      Alert.alert('錯誤', '使用人數必須為正整數。');
      return;
    }

    if (!worklogData.daily_check || !worklogData.periodic_check) {
      Alert.alert('錯誤', '每日檢點記錄和定期檢點記錄必須先建立。');
      return;
    }

    const worklogPayload = {
      duty_id: scheduleId,
      description: description.trim(),
      usage_count: usageCountInt,
      is_final: true,
      status: '待審核',
    };

    try {
      await submitWorklog(worklogPayload);
      Alert.alert('提交成功', '工作日誌已提交');
      router.back(); // 返回到上一頁面
    } catch (error) {
      console.error('Failed to submit worklog', error);
      Alert.alert('提交失敗', '無法提交工作日誌');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.checklistContainer}>
        <Text style={styles.checklistContent}>{worklogData.daily_check ? '✔️' : '❌'} 每日檢點記錄</Text>
        <Text style={styles.checklistContent}>{worklogData.periodic_check ? '✔️' : '❌'} 定期檢點記錄</Text>
        <Text style={styles.checklistContent}>{worklogData.special_check ? '✔️' : '❌'} 特殊檢點記錄</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="描述"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="使用人數"
        value={usageCount}
        onChangeText={setUsageCount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitWorklog}>
        <Text style={styles.submitButtonText}>送出工作日誌</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.lightWhite,
  },
  checklistContainer: {
    marginVertical: 20,
  },
  checklistContent: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: SIZES.medium,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
});

export default LifeguardSingoutScreen;
