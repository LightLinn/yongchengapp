import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchPermissions, updatePermission } from '../../../api/groupApi';
import { COLORS, SIZES } from '../../../styles/theme';

const PermissionEditorScreen = () => {
  const router = useRouter();
  const { groupId, groupName } = useLocalSearchParams();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const loadPermissions = async () => {
      const fetchedPermissions = await fetchPermissions(groupId);
      // 按 screen_name 排序
      const sortedPermissions = fetchedPermissions.sort((a, b) => {
        if (a.screen_name.screen_name < b.screen_name.screen_name) return -1;
        if (a.screen_name.screen_name > b.screen_name.screen_name) return 1;
        return 0;
      });
      setPermissions(sortedPermissions);
    };

    loadPermissions();
  }, [groupId]);

  const togglePermission = async (permissionId, field) => {
    const updatedPermissions = permissions.map((perm) =>
      perm.id === permissionId ? { ...perm, [field]: !perm[field] } : perm
    );
    setPermissions(updatedPermissions);
    const updatedPermission = updatedPermissions.find((perm) => perm.id === permissionId);
    await updatePermission(permissionId, { [field]: updatedPermission[field] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{groupName}</Text>
      {permissions.map((perm) => (
        <View key={perm.id} style={styles.permissionItem}>
          <Text style={styles.screenName}>{perm.screen_name.screen_name}</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>查看</Text>
              <Switch
                value={perm.can_view}
                style={styles.switch}
                onValueChange={() => togglePermission(perm.id, 'can_view')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>新增</Text>
              <Switch
                value={perm.can_create}
                style={styles.switch}
                onValueChange={() => togglePermission(perm.id, 'can_create')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>編輯</Text>
              <Switch
                value={perm.can_edit}
                style={styles.switch}
                onValueChange={() => togglePermission(perm.id, 'can_edit')}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>刪除</Text>
              <Switch
                value={perm.can_delete}
                style={styles.switch}
                onValueChange={() => togglePermission(perm.id, 'can_delete')}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.lightWhite,
  },
  header: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    alignSelf: 'center',
  },
  permissionItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 10,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  screenName: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'column',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
});

export default PermissionEditorScreen;
