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
import { Sun, Moon, LogOut, User, Menu, Search, Sparkles } from 'lucide-react';
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
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 z-40 transition-all duration-500 ease-in-out px-4 sm:px-6",
        collapsed ? "md:left-16" : "md:left-72",
        "left-0"
      )}
    >
      <div className="h-full glass rounded-2xl border-white/10 mt-2 flex items-center justify-between px-5 shadow-xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />

        {/* Left Side */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 rounded-xl hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </Button>
          

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {title}
            </h1>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/5">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Pro Active</span>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl hover:bg-white/5"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-white/5 transition-all group">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                      {user?.name || 'Commander'}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Commander
                    </p>
                  </div>
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-white/10 ring-2 ring-primary/20 transition-all group-hover:ring-primary/50">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-black rounded-none text-xs">
                      {getInitials(user?.name || 'CM')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 glass rounded-3xl border-white/10 p-2 shadow-2xl mt-4">
                <div className="p-4 rounded-2xl bg-white/5 mb-2">
                  <p className="text-sm font-black text-foreground">{user?.name || 'Commander'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl h-11 font-bold focus:bg-primary/10">
                  <User className="h-4 w-4 mr-3 text-primary" />
                  Profile Configuration
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl h-11 font-bold text-destructive focus:bg-destructive/10">
                  <LogOut className="h-4 w-4 mr-3" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
