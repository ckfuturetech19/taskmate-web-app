import React, { useEffect } from 'react';
import Lenis from 'lenis';

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

export const CinematicLanding: React.FC = () => {
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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05020c] text-slate-800 dark:text-slate-200 transition-colors duration-500 font-sans selection:bg-cyan-500/20">
      
      {/* Decorative Aurora Background Blobs - subtle and aligned with modern clean portfolio layouts */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-purple-500/5 via-cyan-500/0 to-transparent blur-[100px] pointer-events-none" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Different / Counter Stats Section */}
      <DifferentSection />

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

    </div>
  );
};

export default CinematicLanding;
