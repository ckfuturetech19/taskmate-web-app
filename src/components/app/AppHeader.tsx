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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sun, Moon, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';
import { cn } from '@/lib/utils';

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
    <header 
      className={cn(
        "fixed top-0 right-0 h-14 sm:h-16 bg-background border-b border-border z-[60] transition-all duration-300",
        "left-0",
        // Desktop: Adjust left based on sidebar state
        collapsed ? "lg:left-16" : "lg:left-64"
      )}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4" style={{ pointerEvents: 'auto' }}>
        {/* Left Side - Hamburger Menu (Mobile/Tablet) + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0" style={{ pointerEvents: 'auto' }}>
          {/* Hamburger Menu Button - Only visible on mobile/tablet */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Hamburger menu clicked!', { onMenuClick: !!onMenuClick });
              if (onMenuClick) {
                console.log('Calling onMenuClick handler');
                onMenuClick();
              } else {
                console.warn('onMenuClick handler is not defined!');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger menu activated via keyboard');
                if (onMenuClick) {
                  onMenuClick();
                }
              }
            }}
            className={cn(
              "lg:hidden h-9 w-9 shrink-0 z-[60] relative",
              "flex items-center justify-center",
              "rounded-md hover:bg-accent hover:text-accent-foreground",
              "transition-colors cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "bg-transparent border-none outline-none"
            )}
            style={{ pointerEvents: 'auto' }}
            aria-label="Open navigation menu"
            aria-expanded="false"
            type="button"
          >
            <Menu className="h-5 w-5 pointer-events-none" />
          </button>
          
          {/* Page Title - Always visible */}
          <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
            {title}
          </h1>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 shrink-0">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={undefined} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
