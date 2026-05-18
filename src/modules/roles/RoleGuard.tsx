import React, { ReactNode } from 'react';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { WorkspaceRole } from '@/types/workspace';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: WorkspaceRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  requiredPermission, 
  fallback = null 
}) => {
  const { role, hasPermission } = useWorkspace();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
