import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Calculate scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer to track active screen section
  useEffect(() => {
    const sections = ['features', 'how-it-works', 'pricing', 'faq'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' } // Detect centers of sections
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 lg:px-12 flex items-center justify-between ${
          isScrolled 
            ? 'shadow-xs border-b bg-white/85 dark:bg-[#05020c]/85 border-slate-200 dark:border-white/5' 
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        }}
      >
        {/* Branding Logo & Text */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoImg} alt="TaskMate Logo" className="w-8 h-8 object-contain rounded-lg animate-pulse" />
          
          {/* Shimmer animation on brand text */}
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white relative overflow-hidden">
            TaskMate AI
          </span>
        </div>

        {/* Desktop Menu with Active Highlights and Sliding Indicator */}
        <div className="hidden md:flex items-center gap-8">
          {['features', 'how-it-works', 'pricing', 'faq'].map((section) => {
            const label = section === 'how-it-works' ? 'How it works' : section.charAt(0).toUpperCase() + section.slice(1);
            const isActive = activeSection === section;
            return (
              <button 
                key={section}
                onClick={() => scrollToSection(section)} 
                className={`text-sm font-medium transition-colors relative py-1 cursor-pointer ${
                  isActive 
                    ? 'text-[#8B65C8] dark:text-[#C4B8E8]' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#8B65C8] dark:hover:text-[#8B65C8]'
                }`}
              >
                {label}
                {isActive && (
                  <motion.span 
                    layoutId="activeNavIndicator" 
                    className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#F0607A] to-[#8B65C8] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 transition-all text-slate-800 dark:text-white cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => navigate('/auth')} 
            className="hidden md:block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors cursor-pointer"
          >
            Sign in
          </button>
          
          <button 
            onClick={() => navigate('/auth')} 
            className="px-6 py-2.5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white text-sm font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
          >
            {/* Shimmer light bar across CTA button */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
            Download Free →
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-2xl text-slate-800 dark:text-white cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dynamic Scroll Progress Bar at bottom of navbar */}
        <div 
          className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#F0607A] to-[#8B65C8] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#05020c] p-8 pt-24 md:hidden flex flex-col gap-6">
          {['features', 'how-it-works', 'pricing', 'faq'].map((section) => {
            const label = section === 'how-it-works' ? 'How it works' : section.charAt(0).toUpperCase() + section.slice(1);
            return (
              <button 
                key={section}
                onClick={() => scrollToSection(section)} 
                className="text-2xl font-bold text-slate-800 dark:text-white text-left hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors cursor-pointer"
              >
                {label}
              </button>
            );
          })}
          <hr className="border-slate-200 dark:border-white/5" />
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/auth'); }} className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold text-slate-800 dark:text-white hover:bg-slate-100 transition-colors">Sign in</button>
        </div>
      )}
    </>
  );
};

export default LandingNav;
