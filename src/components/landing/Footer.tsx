import { useTheme } from '@/contexts/ThemeContext';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="py-20 bg-[var(--aurora-bg-primary)] border-t border-[var(--aurora-border)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-left">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="10" fill="url(#logoGradFooter)"></rect>
                <defs>
                  <linearGradient id="logoGradFooter" x1="0" y1="40" x2="40" y2="0">
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
            <p className="text-[var(--aurora-text-secondary)] text-sm mb-6 leading-relaxed">
              Reimagining productivity for the AI era. Plan smarter, live better.
            </p>
            <p className="text-xs text-[var(--aurora-text-muted)]">
              Made with ❤️ in Ahmedabad, India 🇮🇳
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold mb-6 text-[var(--aurora-text-primary)]">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--aurora-text-secondary)]">
              <li><a href="#features" className="hover:text-[#8B65C8] transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-[#8B65C8] transition-colors">How it works</a></li>
              <li><a href="#pricing" className="hover:text-[#8B65C8] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#8B65C8] transition-colors">Release Notes</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-[var(--aurora-text-primary)]">Company</h4>
            <ul className="space-y-4 text-sm text-[var(--aurora-text-secondary)]">
              <li><a href="#" className="hover:text-[#8B65C8] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#8B65C8] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#8B65C8] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#8B65C8] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-6 text-[var(--aurora-text-primary)]">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] flex items-center justify-center hover:bg-[#8B65C8] hover:text-white transition-all text-[var(--aurora-text-primary)]">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] flex items-center justify-center hover:bg-[#8B65C8] hover:text-white transition-all text-[var(--aurora-text-primary)]">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] flex items-center justify-center hover:bg-[#8B65C8] hover:text-white transition-all text-[var(--aurora-text-primary)]">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] flex items-center justify-center hover:bg-[#8B65C8] hover:text-white transition-all text-[var(--aurora-text-primary)]">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--aurora-border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[var(--aurora-text-muted)]">
            © 2025 TaskMate AI. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-[var(--aurora-text-muted)]">
            <a href="#" className="hover:text-[var(--aurora-text-primary)] transition-colors">Security</a>
            <a href="#" className="hover:text-[var(--aurora-text-primary)] transition-colors">Status</a>
            <a href="#" className="hover:text-[var(--aurora-text-primary)] transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
