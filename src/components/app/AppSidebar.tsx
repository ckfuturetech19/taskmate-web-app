import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Bell, Settings, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useState, useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Groups', path: '/groups' },
  { icon: Bell, label: 'Notifications', path: '/notifications', showBadge: true },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface AppSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AppSidebar = ({ mobileMenuOpen, setMobileMenuOpen }: AppSidebarProps) => {
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40",
          // Desktop: always visible, collapsible
          "lg:block",
          collapsed ? "lg:w-16" : "lg:w-60",
          // Mobile: slide in from left
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-60"
        )}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 lg:hidden h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      <div className="flex flex-col h-full">
        <div className={cn(
          "h-16 flex items-center border-b border-border px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="../../assets/images/logo.png" 
                alt="TaskMate Logo" 
                className="h-7 w-7 rounded-lg"
              />
              <span className="font-semibold text-foreground">TaskMate</span>
            </div>
          )}
          {collapsed && (
            <img 
              src="../../assets/images/logo.png" 
              alt="TaskMate Logo" 
              className="h-6 w-6 rounded-lg"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("h-8 w-8 hidden lg:flex", collapsed && "absolute -right-4 bg-card border border-border rounded-full")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.showBadge && unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </div>
              {!collapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.showBadge && unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-[10px]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
    </>
  );
};

export default AppSidebar;
