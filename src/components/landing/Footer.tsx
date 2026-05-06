import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const Footer = () => {
  const { theme } = useTheme();

  const footerLinks = [
    {
      title: 'PILLARS',
      links: [
        { name: 'Task Engine', href: '#' },
        { name: 'Note Layering', href: '#' },
        { name: 'Circle Logic', href: '#' },
        { name: 'Neural Sync', href: '#' },
      ]
    },
    {
      title: 'RESOURCES',
      links: [
        { name: 'System Status', href: '#' },
        { name: 'Beta Protocols', href: '#' },
        { name: 'API Docs', href: '#' },
        { name: 'Security Hub', href: '#' },
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { name: 'Evolution', href: '#' },
        { name: 'Ethics', href: '#' },
        { name: 'Command Center', href: '#' },
        { name: 'Legal', href: '#' },
      ]
    }
  ];

  return (
    <footer className={cn(
      "py-32 px-4 transition-colors duration-700",
      theme === 'dark' ? "bg-transparent" : "bg-white"
    )}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          {/* Brand Column */}
          <div className="space-y-12">
            <Link to="/" className="flex items-center gap-6 group">
              <div className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500",
                theme === 'dark' 
                  ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 glow-primary" 
                  : "bg-white border border-primary/20 shadow-xl"
              )}>
                <img src="/logo.png" alt="TaskMate" className="h-10 w-10 relative z-10" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-3xl font-black tracking-tighter leading-none transition-colors",
                  theme === 'dark' ? "text-white" : "text-black"
                )}>
                  TASKMATE
                </span>
                <span className="text-[11px] font-black text-primary tracking-[0.4em] uppercase mt-2">
                  PRO VERSION 2.0
                </span>
              </div>
            </Link>

            <p className={cn(
              "text-2xl md:text-3xl font-bold leading-tight max-w-md transition-colors",
              theme === 'dark' ? "text-white/40" : "text-black/40"
            )}>
              Architecting the future of unified productivity. One node at a time.
            </p>

            <div className="flex gap-10">
              {['TWITTER', 'GITHUB', 'DISCORD'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className={cn(
                    "text-[10px] font-black tracking-[0.3em] transition-colors hover:text-primary",
                    theme === 'dark' ? "text-white/20" : "text-black/20"
                  )}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-10">
                <h4 className={cn(
                  "text-[11px] font-black tracking-[0.4em] uppercase transition-colors",
                  theme === 'dark' ? "text-white" : "text-black"
                )}>
                  {section.title}
                </h4>
                <ul className="space-y-6">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className={cn(
                          "text-base font-bold transition-all hover:text-primary hover:translate-x-1 inline-block",
                          theme === 'dark' ? "text-white/40" : "text-black/40"
                        )}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "pt-16 border-t flex flex-col md:flex-row justify-between items-center gap-8 transition-colors",
          theme === 'dark' ? "border-white/5" : "border-black/5"
        )}>
          <span className={cn(
            "text-[10px] font-black tracking-[0.3em] uppercase transition-colors",
            theme === 'dark' ? "text-white/20" : "text-black/20"
          )}>
            © 2026 TASKMATE PROTOCOL. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-10">
            <span className={cn(
              "text-[10px] font-black tracking-[0.3em] uppercase transition-colors",
              theme === 'dark' ? "text-white/20" : "text-black/20"
            )}>
              PRIVACY POLICY
            </span>
            <span className={cn(
              "text-[10px] font-black tracking-[0.3em] uppercase transition-colors",
              theme === 'dark' ? "text-white/20" : "text-black/20"
            )}>
              TERMS OF SERVICE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Footer;
