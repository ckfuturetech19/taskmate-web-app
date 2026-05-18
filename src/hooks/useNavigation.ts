import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Briefcase, 
  MessageSquare,
  Bell,
  Clock,
  Shield
} from 'lucide-react';
import { useWorkspace } from '@/providers/WorkspaceProvider';

export const useNavigation = () => {
  const { currentWorkspace, role, hasPermission } = useWorkspace();

  const personalItems = [
    { icon: LayoutDashboard, label: 'My Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'My Tasks', path: '/tasks' },
    { icon: FileText, label: 'My Notes', path: '/notes' },
    { icon: Bell, label: 'Reminders', path: '/reminders' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const companyItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Team Tasks', path: '/team-tasks' },
    { icon: Users, label: 'Members', path: '/members' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Workspace Settings', path: '/workspace-settings', permission: 'ADMIN' },
  ];

  const filteredCompanyItems = companyItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return currentWorkspace?.workspaceType === 'COMPANY' ? filteredCompanyItems : personalItems;
};
