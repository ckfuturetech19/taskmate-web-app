import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <img 
            src="../../assets/images/logo.png" 
            alt="TaskMate Logo" 
            className="h-8 w-8 md:h-10 md:w-10 rounded-lg group-hover:scale-110 transition-transform duration-300 shrink-0"
          />
          <span className="text-xl md:text-2xl font-bold text-foreground truncate">TaskMate</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Pricing
          </button>
          <Link 
            to="/contact"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contacts
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
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
          
          <Link to="/auth" className="hidden md:block">
            <Button variant="ghost" size="sm" className="text-sm">
              Log in
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="default" size="sm" className="gap-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm">
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
