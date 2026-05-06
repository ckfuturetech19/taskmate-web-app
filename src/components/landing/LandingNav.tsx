import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'CORE', id: 'features' },
    { name: 'FLOW', id: 'how-it-works' },
    { name: 'PRICING', id: 'pricing' },
    { name: 'SUPPORT', id: 'faq' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4"
      >
        <div className={cn(
          "flex items-center justify-between w-full max-w-7xl h-16 md:h-20 px-6 md:px-10 transition-all duration-700 rounded-full border",
          isScrolled || isMobileMenuOpen
            ? theme === 'dark'
              ? "glass-dark border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[0.98]" 
              : "bg-white/80 backdrop-blur-xl border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[0.98]"
            : "bg-transparent border-transparent"
        )}>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-5 group">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500",
                theme === 'dark' 
                  ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 glow-primary" 
                  : "bg-white border border-primary/20 shadow-xl"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              <img src="/logo.png" alt="TaskMate" className="h-7 w-7 md:h-8 md:w-8 relative z-10" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <div className="flex flex-col">
              <span className={cn(
                "text-xl md:text-2xl font-black tracking-tighter leading-none transition-colors",
                theme === 'dark' ? "text-white" : "text-black"
              )}>
                TASK<span className="text-primary italic">MATE</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black text-muted-foreground tracking-[0.3em] uppercase">Enterprise 2.0</span>
              </div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "text-[11px] font-black transition-all tracking-[0.3em] uppercase py-2 relative group",
                  theme === 'dark' ? "text-white/50 hover:text-cyan-400" : "text-black/50 hover:text-cyan-600"
                )}
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-500" />
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center transition-all border",
                theme === 'dark' 
                  ? "glass border-white/10 text-white/70 hover:text-cyan-400" 
                  : "bg-black/5 border-black/10 text-black/70 hover:text-cyan-600"
              )}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/auth" className="hidden md:block">
              <button className={cn(
                "text-[11px] font-black tracking-[0.2em] uppercase transition-colors px-4",
                theme === 'dark' ? "text-white hover:text-cyan-400" : "text-black hover:text-cyan-600"
              )}>
                LOGIN
              </button>
            </Link>
            
            <Link to="/auth" className="hidden sm:block">
              <button className="h-11 md:h-13 px-8 rounded-full bg-cyan-400 text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-cyan-300 active:scale-95 transition-all shadow-lg shadow-cyan-500/20">
                START FREE
              </button>
            </Link>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn("lg:hidden h-10 w-10", theme === 'dark' ? "text-white" : "text-black")}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed inset-0 z-40 lg:hidden pt-32 px-6",
              theme === 'dark' ? "bg-black/95 backdrop-blur-2xl" : "bg-white/95 backdrop-blur-2xl"
            )}
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={cn(
                    "text-4xl font-black tracking-tighter text-left py-2 border-b transition-all",
                    theme === 'dark' ? "text-white border-white/5 hover:text-primary" : "text-black border-black/5 hover:text-primary"
                  )}
                >
                  {link.name}
                </button>
              ))}
              
              <div className="flex flex-col gap-4 mt-10">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full h-16 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-[0.3em] text-[12px]">
                    START FREE NOW
                  </button>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className={cn(
                    "w-full h-16 rounded-[1.5rem] border font-black uppercase tracking-[0.3em] text-[12px]",
                    theme === 'dark' ? "border-white/10 text-white" : "border-black/10 text-black"
                  )}>
                    LOGIN TO ACCOUNT
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default LandingNav;
