import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workspace, WorkspaceRole, WorkspaceState } from '@/types/workspace';
import api from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WorkspaceContextType extends WorkspaceState {
  setCurrentWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const WORKSPACE_STORAGE_KEY = 'taskmate_current_workspace';

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<WorkspaceState>({
    currentWorkspace: null,
    workspaces: [],
    permissions: [],
    role: null,
    isLoading: true,
    error: null,
  });

  const fetchWorkspaces = async () => {
    if (!user) {
      setState(prev => ({
        ...prev,
        currentWorkspace: null,
        workspaces: [],
        role: null,
        permissions: [],
        isLoading: false
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.get('/workspaces/me');
      const workspacesData = response.data.success ? response.data.data : response.data;
      const workspaces: Workspace[] = workspacesData;
      
      let current = null;
      const storedWorkspaceId = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      
      if (storedWorkspaceId) {
        current = workspaces.find(w => w.id === storedWorkspaceId) || workspaces[0] || null;
      } else {
        current = workspaces[0] || null;
      }

      // If we have a current workspace, fetch its permissions/role
      let role: WorkspaceRole | null = null;
      let permissions: string[] = [];

      if (current) {
        try {
          const roleRes = await api.get(`/workspaces/${current.id}/my-role`);
          const roleData = roleRes.data.success ? roleRes.data.data : roleRes.data;
          role = roleData.role;
          permissions = roleData.permissions || [];
        } catch (e) {
          console.warn('Failed to fetch role via API, falling back to local check', e);
          // Fallback: Check if user is owner or has member entry
          if (current.ownerId === user.id || current.type === 'PERSONAL' || current.workspaceType === 'PERSONAL') {
            role = 'OWNER';
            permissions = ['*']; // Full permissions for owner
          } else {
            // Try to find user in members array if it exists
            const membership = (current as any).members?.find((m: any) => m.userId === user.id);
            if (membership) {
              role = typeof membership.role === 'object' ? membership.role.name : membership.role;
            }
          }
        }
        localStorage.setItem(WORKSPACE_STORAGE_KEY, current.id);
      }

      setState({
        workspaces,
        currentWorkspace: current,
        role,
        permissions,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Failed to fetch workspaces', err);
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [user]);

  const setCurrentWorkspace = async (workspace: Workspace) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id);
      
      let role: WorkspaceRole | null = null;
      let permissions: string[] = [];

      try {
        const roleRes = await api.get(`/workspaces/${workspace.id}/my-role`);
        const roleData = roleRes.data.success ? roleRes.data.data : roleRes.data;
        role = roleData.role;
        permissions = roleData.permissions || [];
      } catch (e) {
        console.warn('Switch fallback: using local role info', e);
        if (workspace.ownerId === user?.id || workspace.type === 'PERSONAL' || workspace.workspaceType === 'PERSONAL') {
          role = 'OWNER';
          permissions = ['*'];
        } else {
          const membership = (workspace as any).members?.find((m: any) => m.userId === user?.id);
          if (membership) {
            role = typeof membership.role === 'object' ? membership.role.name : membership.role;
          }
        }
      }
      
      setState(prev => ({
        ...prev,
        currentWorkspace: workspace,
        role,
        permissions,
        isLoading: false,
      }));

      toast.success(`Switched to ${workspace.name}`);
    } catch (err) {
      console.error('Critical switch error', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const hasPermission = (permission: string) => {
    // Owner and Admin have all permissions
    if (state.role === 'OWNER' || state.role === 'ADMIN') return true;
    
    const p = permission.toLowerCase();

    // Check specific permission in permissions array (handles both styles)
    if (state.permissions.includes(p) || 
        state.permissions.includes(p.replace('_', '.')) ||
        state.permissions.includes(permission)) {
      return true;
    }

    // Fallback role-based logic if permissions array is empty/unreliable
    const isManager = state.role === 'MANAGER';
    const isEmployee = state.role === 'EMPLOYEE';

    if (p === 'project_create' || p === 'project.create') return isManager;
    if (p === 'task_create' || p === 'task.create') return isManager || isEmployee;
    if (p === 'task_update' || p === 'task.update') return isManager || isEmployee;
    if (p === 'member_invite' || p === 'member.invite') return isManager;

    return false;
  };

  return (
    <WorkspaceContext.Provider 
      value={{ 
        ...state, 
        setCurrentWorkspace, 
        refreshWorkspaces: fetchWorkspaces,
        hasPermission 
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
