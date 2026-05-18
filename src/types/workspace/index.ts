export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type WorkspaceType = 'PERSONAL' | 'COMPANY';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: WorkspaceType;
  workspaceType?: WorkspaceType;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;
  settings?: WorkspaceSettings;
}

export interface WorkspaceSettings {
  timezone: string;
  notificationPreferences: Record<string, boolean>;
  attendanceEnabled: boolean;
  trackingEnabled: boolean;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  permissions: string[];
  role: WorkspaceRole | null;
  isLoading: boolean;
  error: string | null;
}
