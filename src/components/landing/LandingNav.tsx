import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

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
            ? 'shadow-lg border-b bg-[var(--aurora-nav-bg)] border-[var(--aurora-border)]' 
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="url(#logoGradNav)"></rect>
            <defs>
              <linearGradient id="logoGradNav" x1="0" y1="40" x2="40" y2="0">
                <stop offset="0%" stop-color="#F5A87B"></stop>
                <stop offset="30%" stop-color="#F0607A"></stop>
                <stop offset="65%" stop-color="#8B65C8"></stop>
                <stop offset="100%" stop-color="#4ABFB8"></stop>
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="11" stroke="white" stroke-width="2.5" fill="none"></circle>
            <path d="M14 20.5L18 24.5L26 16" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span className="text-xl font-bold tracking-tight text-[var(--aurora-text-primary)]">TaskMate AI</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-purple)] transition-colors">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-purple)] transition-colors">How it works</button>
          <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-purple)] transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="text-sm font-medium text-[var(--aurora-text-secondary)] hover:text-[var(--aurora-purple)] transition-colors">FAQ</button>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] hover:bg-[var(--aurora-bg-tertiary)] transition-all text-[var(--aurora-text-primary)]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => navigate('/auth')} 
            className="hidden md:block text-sm font-bold text-[var(--aurora-text-primary)] hover:text-[var(--aurora-purple)] transition-colors"
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
            className="md:hidden p-2 text-2xl text-[var(--aurora-text-primary)]"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--aurora-bg-primary)] p-8 pt-24 md:hidden flex flex-col gap-6">
          <button onClick={() => scrollToSection('features')} className="text-2xl font-bold text-[var(--aurora-text-primary)] text-left hover:text-[var(--aurora-purple)] transition-colors">Features</button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-2xl font-bold text-[var(--aurora-text-primary)] text-left hover:text-[var(--aurora-purple)] transition-colors">How it works</button>
          <button onClick={() => scrollToSection('pricing')} className="text-2xl font-bold text-[var(--aurora-text-primary)] text-left hover:text-[var(--aurora-purple)] transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('faq')} className="text-2xl font-bold text-[var(--aurora-text-primary)] text-left hover:text-[var(--aurora-purple)] transition-colors">FAQ</button>
          <hr className="border-[var(--aurora-border)]" />
          <button onClick={() => { setIsMobileMenuOpen(false); navigate('/auth'); }} className="w-full py-4 rounded-2xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] font-bold text-[var(--aurora-text-primary)] hover:bg-[var(--aurora-bg-tertiary)] transition-colors">Sign in</button>
        </div>
      )}
    </>
  );
};

export default LandingNav;
