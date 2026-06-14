import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import HeroSection from './HeroSection';
import DifferentSection from './DifferentSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import IntegrationsSection from './IntegrationsSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import Footer from './Footer';
import InteractivePlayground from './InteractivePlayground';
import FloatingWorkspace from './FloatingWorkspace';

export const CinematicLanding: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Initialize Lenis lightweight smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Show/hide scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05020c] text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-cyan-500/20">
      
      {/* Decorative Aurora Background Blobs */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-purple-500/5 via-cyan-500/0 to-transparent blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Different / Counter Stats Section */}
      <DifferentSection />

      {/* Interactive Sandbox Playground */}
      <InteractivePlayground />

      {/* Interactive Floating Workspace */}
      <FloatingWorkspace />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Integrations Section */}
      <IntegrationsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing / Journeys Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-40 p-3.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-lg hover:border-[#8B65C8]/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CinematicLanding;
