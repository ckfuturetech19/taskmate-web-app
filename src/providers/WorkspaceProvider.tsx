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
      const mockWorkspace: Workspace = {
        id: 'personal-workspace',
        name: 'Personal Workspace',
        ownerId: user.id,
        type: 'PERSONAL',
        workspaceType: 'PERSONAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(WORKSPACE_STORAGE_KEY, mockWorkspace.id);

      setState({
        workspaces: [mockWorkspace],
        currentWorkspace: mockWorkspace,
        role: 'OWNER',
        permissions: ['*'],
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
      
      setState(prev => ({
        ...prev,
        currentWorkspace: workspace,
        role: 'OWNER',
        permissions: ['*'],
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
