import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUserPermissions } from '../api/groupApi';
import { fetchUserProfile } from '../api/profileApi';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }) => {
  const { userId, permissions, setPermissions } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ groupIds, setGroupIds ] = useState([]);

  const loadPermissions = async () => {
    setLoading(true);
    setPermissions([]);
    try {
      const userProfile = await fetchUserProfile(userId);
      const groupIds = userProfile.groupIds;
      setGroupIds(groupIds);
      console.log('groupIds', groupIds);

      const userPermissions = await fetchUserPermissions(groupIds);
      const mergedPermissions = {};
      userPermissions.forEach((perm) => {
        const screenName = perm.screen_name.screen_name;
        if (!mergedPermissions[screenName]) {
          mergedPermissions[screenName] = {
            screen_name: screenName,
            can_view: perm.can_view,
            can_edit: perm.can_edit,
            can_create: perm.can_create,
            can_delete: perm.can_delete,
          };
        } else {
          mergedPermissions[screenName].can_view = mergedPermissions[screenName].can_view || perm.can_view;
          mergedPermissions[screenName].can_edit = mergedPermissions[screenName].can_edit || perm.can_edit;
          mergedPermissions[screenName].can_create = mergedPermissions[screenName].can_create || perm.can_create;
          mergedPermissions[screenName].can_delete = mergedPermissions[screenName].can_delete || perm.can_delete;
        }
      });

      setPermissions(Object.values(mergedPermissions));
    } catch (error) {
      console.error('Failed to load permissions', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (userId) {
      loadPermissions();
    }
  }, [userId]);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, refresh: loadPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
