import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchGroupPermissions, addPermissionToGroup, removePermissionFromGroup, fetchPermissions } from '../../../api/groupApi';
import { COLORS, SIZES, FONT } from '../../../styles/theme';

const PermissionEditorScreen = () => {
  const { groupId, groupName } = useLocalSearchParams();
  const [permissions, setPermissions] = useState([]);
  const [groupPermissions, setGroupPermissions] = useState([]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const allPermissions = await fetchPermissions();
        setPermissions(allPermissions);
        const groupPerms = await fetchGroupPermissions(groupId);
        console.log('Group Permissions:', groupPerms); // 調試信息
        setGroupPermissions(groupPerms);
      } catch (error) {
        console.error('Failed to load permissions', error);
      }
    };

    loadPermissions();
  }, [groupId]);

  const handleTogglePermission = async (permission) => {
    try {
      if (groupPermissions.some((perm) => perm.codename === permission.codename)) {
        await removePermissionFromGroup(groupId, permission.codename);
      } else {
        await addPermissionToGroup(groupId, permission.codename);
      }
      const updatedGroupPermissions = await fetchGroupPermissions(groupId);
      setGroupPermissions(updatedGroupPermissions);
    } catch (error) {
      console.error('Failed to toggle permission', error);
    }
  };

  if (!permissions || !groupPermissions) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName}</Text>
      <FlatList
        data={permissions}
        keyExtractor={(item) => item.codename}
        renderItem={({ item }) => (
          <View style={styles.permissionItem}>
            <Text>{item.name}</Text>
            <Switch
              trackColor={{ false: COLORS.white, true: COLORS.tertiary }}
              thumbColor={groupPermissions.some((perm) => perm.codename === item.codename) ? COLORS.lightWhite : COLORS.white}
              ios_backgroundColor={COLORS.gray2}
              onValueChange={() => handleTogglePermission(item)}
              value={groupPermissions.some((perm) => perm.codename === item.codename)}
              style={styles.switch}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
});

export default PermissionEditorScreen;
