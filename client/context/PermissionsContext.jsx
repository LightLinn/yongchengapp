import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUserPermissions } from '../api/groupApi';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }) => {
  const { groupIds, permissions, setPermissions } = useAuth();
  // const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    setLoading(true);
    setPermissions([]);
    try {
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
    if (groupIds && groupIds.length > 0) {
      loadPermissions();
    }
  }, [groupIds]);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, refresh: loadPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
