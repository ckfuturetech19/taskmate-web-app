import logoImg from '../../assets/logo.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, BarChart3, Settings, ChevronLeft, ChevronRight, Timer, Users, FileText, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks', showBadge: true },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Award, label: 'Milestones', path: '/milestones' },
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
  const { user } = useAuth();
  const { getPersonalTasks } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const personalTasks = getPersonalTasks();
  const pendingTaskCount = personalTasks.filter(task => !task.isCompleted).length;

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : 'TM';

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <motion.aside 
        initial={false}
        animate={{ 
          width: collapsed ? 64 : 240,
          x: mobileMenuOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -240
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 38, mass: 0.8 }}
        className="fixed left-0 top-0 h-full z-50 flex flex-col bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] overflow-hidden"
        style={{ boxShadow: '2px 0 20px rgba(123,47,190,0.06), 1px 0 0 rgba(123,47,190,0.08)' }}
      >
        {/* Logo Header */}
        <div className="h-[56px] flex items-center px-4 border-b border-[var(--border-default)] justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.img 
              src={logoImg} 
              alt="Logo" 
              className="h-8 w-8 rounded-[8px] shrink-0"
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  className="font-extrabold text-base tracking-tighter text-[var(--text-primary)] whitespace-nowrap"
                >
                  TASK<span className="text-[var(--brand-pink)]">MATE</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {mobileMenuOpen && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden h-8 w-8 rounded-lg">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Section Label */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="px-5 mt-5 mb-1 overflow-hidden"
            >
              <p className="text-[10px] font-semibold text-[var(--text-muted)] tracking-[0.12em] uppercase">
                Navigation
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path}>
                <NavLink 
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={cn(
                    "flex items-center group relative transition-all duration-200",
                    collapsed 
                      ? "justify-center w-10 h-10 mx-auto rounded-xl" 
                      : cn(
                          "px-3 py-2.5 gap-3 mx-1",
                          isActive ? "rounded-r-xl rounded-l-none" : "rounded-xl"
                        ),
                    isActive 
                      ? "text-[var(--text-primary)] font-semibold" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {/* Active background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className={cn(
                        "absolute inset-0 bg-[#FF3CAC]/10 border-l-[3px] border-[var(--brand-pink)]",
                        collapsed ? "rounded-xl" : "rounded-r-xl rounded-l-none"
                      )}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  {/* Hover bg (non-active) */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-[var(--bg-card-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  )}

                  <item.icon className={cn(
                    "h-[18px] w-[18px] shrink-0 relative z-10 transition-all duration-200", 
                    isActive 
                      ? "text-[var(--brand-pink)]" 
                      : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:scale-110"
                  )} />
                  
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.15 }}
                        className="text-[13.5px] relative z-10 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {item.showBadge && pendingTaskCount > 0 && !collapsed && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold text-white relative z-10"
                      style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FBE)' }}
                    >
                      {pendingTaskCount}
                    </motion.span>
                  )}
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* Footer: User + Collapse */}
        <div className="p-2 border-t border-[var(--border-default)] mt-auto flex flex-col gap-1 bg-[var(--bg-sidebar)] shrink-0">
          {/* User profile */}
          <motion.div 
            whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors duration-150",
              collapsed ? "justify-center" : "justify-between"
            )}
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div 
                className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#FF3CAC]/20 transition-all duration-200 hover:ring-[#FF3CAC]/40"
                style={{ background: 'linear-gradient(135deg, #FF3CAC, #7B2FBE)' }}
              >
                {initials}
              </div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col text-left overflow-hidden"
                  >
                    <span className="text-[12.5px] font-semibold text-[var(--text-primary)] truncate leading-tight">
                      {user?.displayName || 'User'}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] truncate leading-tight">
                      {user?.email || 'taskmate@ai.com'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {!collapsed && (
              <Settings className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0 opacity-60" />
            )}
          </motion.div>

          {/* Collapse toggle */}
          <Button 
            variant="ghost" 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full h-9 rounded-xl transition-all hidden md:flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]",
              collapsed ? "justify-center px-0" : "justify-start px-3 gap-2"
            )}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[12.5px] font-medium"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default AppSidebar;
