import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="py-16 bg-white dark:bg-[#05020c] border-t border-slate-200 dark:border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
          
          {/* Brand Info Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3.5 mb-6">
              <img src={logoImg} alt="TaskMate Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TaskMate AI</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Reimagining productivity for the AI era. Plan smarter, live better.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {/* Made with ❤️ in Ahmedabad, India 🇮🇳 */}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold mb-6 text-slate-900 dark:text-white text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#features" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  How it works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-slate-900 dark:text-white text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="/about" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-[#8B65C8] dark:hover:text-purple-400 transition-colors hover:translate-x-1 duration-200 transition-transform inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold mb-6 text-slate-900 dark:text-white text-sm uppercase tracking-wider">Social</h4>
            <div className="flex gap-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-[#8B65C8] hover:text-white dark:hover:bg-[#8B65C8] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-[#8B65C8] hover:text-white dark:hover:bg-[#8B65C8] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-[#8B65C8] hover:text-white dark:hover:bg-[#8B65C8] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center hover:bg-[#8B65C8] hover:text-white dark:hover:bg-[#8B65C8] transition-all text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-mono">
          <p>
            © 2025 TaskMate App AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Status</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
