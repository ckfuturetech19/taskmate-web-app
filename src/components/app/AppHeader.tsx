import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AppHeaderProps {
  title: string;
  collapsed?: boolean;
  onMenuClick?: () => void;
}

const AppHeader = ({ title, collapsed = false, onMenuClick }: AppHeaderProps) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-[100] w-full h-[56px] bg-[var(--bg-card)] backdrop-blur-[12px] border-b border-[var(--border-default)] flex items-center px-4 sm:px-6 justify-between transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Left Side: Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-[var(--brand-pink)] text-xs">●</span>
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">
            {title}
          </span>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2">
          {/* Bell Icon - 36px (h-9 w-9) */}
          <div className="h-9 w-9 flex items-center justify-center">
            <NotificationBell />
          </div>
          
          {/* Theme Toggle - 36px (h-9 w-9) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] shrink-0"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-[var(--bg-card-hover)] transition-all group shrink-0">
                <div className="text-right hidden lg:block">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-pink)] transition-colors leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-none">
                    Member
                  </p>
                </div>
                {/* Initials circle avatar - 36px (h-9 w-9) */}
                <Avatar className="h-9 w-9 rounded-full ring-2 ring-[var(--border-strong)] transition-all group-hover:ring-[var(--brand-pink)]">
                  <AvatarFallback className="bg-[var(--brand-gradient)] text-white font-bold text-xs rounded-full">
                    {getInitials(user?.name || 'US')}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-[var(--bg-card)] rounded-[12px] border border-[var(--border-default)] p-2 shadow-[var(--shadow-modal)] mt-2">
              <div className="p-4 rounded-xl bg-[var(--bg-base)] mb-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'User'}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-lg h-10 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] focus:bg-[var(--bg-card-hover)]">
                <User className="h-4 w-4 mr-3 text-[var(--brand-purple)]" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[var(--border-default)]" />
              <DropdownMenuItem onClick={handleSignOut} className="rounded-lg h-10 text-[13px] font-semibold text-[var(--status-danger)] hover:bg-red-500/10 focus:bg-red-500/10">
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
