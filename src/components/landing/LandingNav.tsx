import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="../../assets/images/logo.png" 
            alt="TaskMate Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">TaskMate</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate&hl=en_IN" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">5.0</span>
            <span className="text-xs">(30+)</span>
          </a>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          
          <Link to="/auth" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-base">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="default" size="sm" className="gap-1 sm:gap-2 shadow-md hover:shadow-lg transition-all duration-300">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
