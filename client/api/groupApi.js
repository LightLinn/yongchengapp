import { API_BASE_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

const getUserId = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return userId;
}

export const fetchGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/groups/`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch groups');
  }
};

// export const fetchUserGroups = async () => {
//   const userId = await getUserId();
//   const response = await fetch(`${API_BASE_URL}/groups/user_groups/?user=${userId}`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) {
//     throw new Error('Failed to fetch user groups');
//   }
//   return await response.json();
// }

// export const fetchPermissions = async () => {
//   const response = await fetch(`${API_BASE_URL}/permissions/`);
//   if (response.ok) {
//     return await response.json();
//   } else {
//     throw new Error('Failed to fetch permissions');
//   }
// };

// export const fetchGroupPermissions = async (groupId) => {
//   const response = await fetch(`${API_BASE_URL}/groups/${groupId}/permissions/`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch group permissions');
//   }
//   const data = await response.json();
//   return Array.isArray(data) ? data : [];
// };

// export const addPermissionToGroup = async (groupId, codename) => {
//   const response = await fetch(`${API_BASE_URL}/groups/${groupId}/add_permission/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ codename }),
//   });
//   if (!response.ok) {
//     throw new Error('Failed to add permission');
//   }
//   return await response.json();
// };

// export const removePermissionFromGroup = async (groupId, codename) => {
//   const response = await fetch(`${API_BASE_URL}/groups/${groupId}/remove_permission/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ codename }),
//   });
//   if (!response.ok) {
//     throw new Error('Failed to remove permission');
//   }
//   return await response.json();
// };

// export const updateGroupPermissions = async (groupId, codenames) => {
//   const response = await fetch(`${API_BASE_URL}/groups/${groupId}/set_permissions/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ codenames }),
//   });
//   if (!response.ok) {
//     throw new Error('Failed to update group permissions');
//   }
//   return response.ok;
// };

export const createGroup = async (name) => {
  const response = await fetch(`${API_BASE_URL}/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create group');
  return await response.json();
};

export const fetchGroupUsers = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/users/`);
  if (!response.ok) throw new Error('Failed to fetch group users');
  return await response.json();
};

export const addUserToGroup = async (groupId, username) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/add_user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return response.ok;
};

export const removeUserFromGroup = async (groupId, username) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/remove_user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return response.ok;
};

export const fetchUserSuggestions = async (query) => {
  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}/users/suggestions/?q=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user suggestions');
  }
  return await response.json();
};

export const fetchUserPermissions = async (groupIds) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/screen_permissions/?group_ids=${groupIds.join(',')}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user permissions');
  }

  return await response.json();
};

export const fetchPermissions = async (groupId) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/permissions/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch permissions');
  }
  return await response.json();
};

export const updatePermission = async (permissionId, updates) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/screen_permissions/${permissionId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update permission');
  }
  return await response.json();
};