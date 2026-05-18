import logoImg from '../../assets/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart3, Settings, ChevronLeft, ChevronRight, X, Shield, LogOut, Smartphone, Timer, Users, UserPlus, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { WorkspaceSwitcher } from '@/modules/workspace/WorkspaceSwitcher';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { useWorkspaceInvitations } from '@/hooks/workspace/useWorkspace';
import { Briefcase, MessageSquare, Bell as BellIcon } from 'lucide-react';
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', showBadge: true },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Users, label: 'Team', path: '/groups' },
  // { icon: UserPlus, label: 'Invitations', path: '/invitations' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Timer, label: 'Clock', path: '/clock' },
];

const workspaceItems = [
  { icon: LayoutDashboard, label: 'Workspace Dashboard', path: '/workspace/dashboard' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: CheckSquare, label: 'Team Tasks', path: '/team-tasks' },
  { icon: Settings, label: 'Workspace Settings', path: '/workspace-settings', role: ['OWNER', 'ADMIN'] },
];

interface AppSidebarProps {
  mobileMenuOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AppSidebar = ({ mobileMenuOpen, onClose, collapsed, setCollapsed }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { getPersonalTasks } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { currentWorkspace, role: userRole } = useWorkspace();
  const { count: invitationCount } = useWorkspaceInvitations();
  
  const personalTasks = getPersonalTasks();
  const pendingTaskCount = personalTasks.filter(task => !task.isCompleted).length;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <motion.aside 
        initial={false}
        animate={{ 
          width: collapsed ? 80 : (window.innerWidth < 1024 ? 260 : 288),
          x: mobileMenuOpen || window.innerWidth >= 768 ? 0 : -320
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-500",
          collapsed ? "p-1" : "p-2",
          "bg-transparent"
        )}
      >
        <div className="h-full glass rounded-xl border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* <WorkspaceSwitcher collapsed={collapsed} /> */}
          <div className={cn("px-3 py-3 mb-1 flex items-center gap-3", collapsed && "px-1.5 justify-center")}>
            <img src={logoImg} alt="Logo" className={cn("h-10 w-10 transition-transform duration-500 hover:rotate-12", collapsed && "h-8 w-8")} />
            {!collapsed && (
              <span className="font-black text-xl tracking-tighter text-foreground leading-none">
                TASK<span className="text-primary">MATE</span>
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-2 overflow-y-auto overflow-x-hidden transition-all duration-300",
            collapsed ? "px-1" : "px-3"
          )}>
            {!collapsed && (
              <div className="px-4 mb-2 mt-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Personal</p>
              </div>
            )}
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={cn(
                    "flex items-center rounded-xl transition-all duration-300 group relative py-2.5",
                    collapsed ? "justify-center px-0 mx-auto w-12" : "justify-start px-4 gap-4",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : cn(
                          "hover:bg-black/5 dark:hover:bg-white/5",
                          theme === 'dark' ? "text-muted-foreground hover:text-foreground" : "text-slate-600 hover:text-black font-bold"
                        )
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-primary")} />
                  {!collapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {item.showBadge && pendingTaskCount > 0 && !collapsed && (
                    <Badge className="ml-auto bg-white/20 text-white border-0 font-black">
                      {pendingTaskCount}
                    </Badge>
                  )}
                  {item.label === 'Invitations' && invitationCount > 0 && !collapsed && (
                    <Badge className="ml-auto bg-primary text-primary-foreground border-0 font-black">
                      {invitationCount}
                    </Badge>
                  )}
                  {isActive && !collapsed && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </NavLink>
              );
            })}

            {/* Workspace Specific Items - Hidden for now */}
            {/* <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
              {!collapsed && (
                <div className="px-4 mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Workspace</p>
                  {currentWorkspace?.workspaceType === 'COMPANY' && (
                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter h-4 px-1 border-primary/20 text-primary">Active</Badge>
                  )}
                </div>
              )}
              
              {workspaceItems.map((item) => {
                // If it's a personal workspace, some items might be hidden or disabled
                const isCompany = currentWorkspace?.workspaceType === 'COMPANY';
                
                // For role-restricted items, check permission
                if (item.role && !item.role.includes(userRole || '')) return null;
                
                const isActive = location.pathname === item.path;
                return (
                  <NavLink 
                    key={item.path} 
                    to={item.path}
                    onClick={() => window.innerWidth < 768 && onClose()}
                    className={cn(
                      "flex items-center rounded-xl transition-all duration-300 group relative py-2.5",
                      collapsed ? "justify-center px-0 mx-auto w-12" : "justify-start px-4 gap-4",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : cn(
                            "hover:bg-black/5 dark:hover:bg-white/5",
                            theme === 'dark' ? "text-muted-foreground hover:text-foreground" : "text-slate-600 hover:text-black font-bold"
                          )
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-primary")} />
                    {!collapsed && (
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {item.label}
                        </span>
                      </div>
                    )}
                    {isActive && !collapsed && (
                      <motion.div 
                        layoutId="active-pill-workspace"
                        className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                      />
                    )}
                  </NavLink>
                );
              })}
            </div> */}
          </nav>

          <div className="p-2 mt-auto">
            <Button 
              variant="ghost" 
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "w-full h-10 rounded-xl transition-all gap-4 hidden md:flex",
                theme === 'dark' 
                  ? "text-muted-foreground hover:bg-white/5 hover:text-foreground" 
                  : "text-slate-600 hover:bg-black/5 hover:text-black",
                collapsed ? "justify-center px-0" : "justify-start px-4"
              )}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              {!collapsed && <span className="font-bold text-sm">Collapse Sidebar</span>}
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="h-24 w-24 text-primary" />
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;

