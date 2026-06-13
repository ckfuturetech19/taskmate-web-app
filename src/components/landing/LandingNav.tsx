import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import logoImg from '@/assets/logo.png';

const LandingNav = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logoImg} alt="TaskMate Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TaskMate AI</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">How it works</button>
          <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">FAQ</button>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 transition-all text-slate-800 dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => navigate('/auth')} 
            className="hidden md:block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors"
          >
            Sign in
          </button>
          <button 
            onClick={() => navigate('/auth')} 
            className="px-6 py-2.5 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white text-sm font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Download Free →
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-2xl text-slate-800 dark:text-white"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-[#05020c] p-8 pt-24 md:hidden flex flex-col gap-6">
          <button onClick={() => scrollToSection('features')} className="text-2xl font-bold text-slate-800 dark:text-white text-left hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-2xl font-bold text-slate-800 dark:text-white text-left hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">How it works</button>
          <button onClick={() => scrollToSection('pricing')} className="text-2xl font-bold text-slate-800 dark:text-white text-left hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="text-2xl font-bold text-slate-800 dark:text-white text-left hover:text-[#8B65C8] dark:hover:text-[#8B65C8] transition-colors">FAQ</button>
          <hr className="border-slate-200 dark:border-white/5" />
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/auth'); }} className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold text-slate-800 dark:text-white hover:bg-slate-100 transition-colors">Sign in</button>
        </div>
      )}
    </>
  );
};

export default LandingNav;
