import logoImg from '../../assets/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart3, Settings, ChevronLeft, ChevronRight, X, Shield, LogOut, Smartphone, Timer, Users, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', showBadge: true },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Users, label: 'Team', path: '/groups' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Timer, label: 'Clock', path: '/clock' },
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
          collapsed ? "p-2" : (window.innerWidth < 1024 ? "p-3" : "p-4"),
          "bg-transparent"
        )}
      >
        <div className="h-full glass rounded-[2.5rem] border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Logo Section */}
          <div className={cn(
            "flex items-center gap-4 transition-all duration-300",
            collapsed ? "justify-center p-3" : "p-6 justify-start"
          )}>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={logoImg} alt="Logo" className={cn(
                "relative z-10 group-hover:rotate-12 transition-transform duration-500",
                collapsed ? "h-8 w-8" : "h-10 w-10"
              )} />
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-black text-xl tracking-tighter text-foreground"
              >
                TASK<span className="text-primary">MATE</span>
              </motion.span>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 space-y-2 mt-4 overflow-y-auto overflow-x-hidden transition-all duration-300",
            collapsed ? "px-1" : "px-3"
          )}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={cn(
                    "flex items-center rounded-2xl transition-all duration-300 group relative py-3.5",
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
                  {isActive && !collapsed && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 mt-auto space-y-4">
            {!collapsed && (
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold truncate",
                    theme === 'dark' ? "text-foreground" : "text-black"
                  )}>{user?.name || 'User'}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Premium</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className={cn(
                  "w-full h-12 rounded-2xl transition-all gap-4",
                  theme === 'dark' 
                    ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive" 
                    : "text-slate-600 hover:bg-destructive/5 hover:text-destructive",
                  collapsed ? "justify-center px-0" : "justify-start px-4"
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="font-bold text-sm">Sign Out</span>}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full h-12 rounded-2xl transition-all gap-4 hidden md:flex",
                  theme === 'dark' 
                    ? "text-muted-foreground hover:bg-white/5 hover:text-foreground" 
                    : "text-slate-600 hover:bg-black/5 hover:text-black",
                  collapsed ? "justify-center px-0" : "justify-start px-4"
                )}
              >
                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                {!collapsed && <span className="font-bold text-sm">Collapse</span>}
              </Button>
            </div>
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

