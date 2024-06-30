import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchGroups, createGroup } from '../../../api/groupApi';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-elements';
import { COLORS, FONT, SIZES } from '../../../styles/theme';
import { usePermissions } from '../../../context/PermissionsContext';

const GroupListScreen = () => {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const router = useRouter();
    const { permissions } = usePermissions();

    useEffect(() => {
        fetchGroups().then(setGroups);
    }, []);

    const handleCreateGroup = async () => {
        if (newGroupName.trim()) {
            await createGroup(newGroupName);
            setNewGroupName('');
            fetchGroups().then(setGroups);
        }
    };

    const hasPermission = (action) => {
        const permission = permissions.find(p => p.screen_name === '角色人員');
        return permission && permission[action];
    };

    const hasAllPermissions = () => {
        return hasPermission('can_edit') && hasPermission('can_view') && hasPermission('can_create') && hasPermission('can_delete');
    };

    return (
        <View style={styles.container}>
            <View style={styles.groupList}>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="新增群組"
                        value={newGroupName}
                        onChangeText={setNewGroupName}
                    />
                    <TouchableOpacity onPress={handleCreateGroup} style={styles.addButton}>
                        <Icon name="add" size={SIZES.small} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.groupItem}>
                            <Text style={styles.groupName}>{item.name}</Text>
                            {hasAllPermissions() && (
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={() => router.push(`/screens/group/PermissionEditorScreen?groupId=${item.id}&groupName=${item.name}`)} style={styles.iconButton}>
                                        <Icon name="edit" size={SIZES.large} color={COLORS.secondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => router.push(`/screens/group/GroupUserListScreen?groupId=${item.id}&groupName=${item.name}`)} style={styles.iconButton}>
                                        <Icon name="list" size={SIZES.xLarge} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    groupList: {
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderColor: COLORS.gray2,
        borderWidth: 1,
        padding: 8,
        flex: 1,
        borderRadius: 4,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 4,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    groupName: {
        fontSize: SIZES.medium,
        color: COLORS.gray3,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 10,
    },
});

export default GroupListScreen;
