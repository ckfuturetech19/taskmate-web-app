import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import DifferentSection from '@/components/landing/DifferentSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden transition-colors duration-700 relative bg-transparent"
      )}
    >
      {/* Top Progress Bar - High Tech Style */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 z-[100] origin-left"
        style={{ scaleX }}
      />

      <LandingNav />
      
      <main className="relative z-10">
        <HeroSection />
        <DifferentSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Landing;
