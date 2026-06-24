import React from 'react';
import SEO from '@/components/SEO';
import LandingNav from '@/components/landing/LandingNav';
import Footer from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Privacy = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative bg-[#05020c] text-slate-200 transition-colors duration-500 font-sans">
      <SEO 
        title="Privacy Policy - TaskMate AI"
        description="TaskMate AI Privacy Policy. Learn how we handle your data, task syncs, local neural model data processing, and user information."
      />
      
      <LandingNav />

      {/* Decorative Blob */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#8B65C8]/10 via-[#4ABFB8]/0 to-transparent blur-[120px] pointer-events-none" />

      <main className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 shadow-sm">
            <Shield className="w-4 h-4 text-[#4ABFB8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4B8E8] font-mono">
              Trust & Data Security
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#8B65C8] font-mono uppercase tracking-widest">
            Last Updated: June 24, 2026
          </p>
        </div>

        <Card className={cn(
          "rounded-[3rem] border overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#8B65C8]/30 mb-16",
          theme === 'dark' 
            ? "bg-slate-950/40 border-white/5 backdrop-blur-xl" 
            : "bg-slate-950/60 border-white/5 backdrop-blur-xl"
        )}>
          <CardContent className="p-8 sm:p-12 text-left space-y-10">
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#8B65C8]/20 flex items-center justify-center text-[#C4B8E8] text-sm font-mono">01</span>
                Information We Collect
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  At TaskMate AI, we are committed to keeping your personal data secure. We collect information you provide directly, such as when creating an account, syncing your calendar, or communicating with us.
                </p>
                <p>
                  This includes your display name, email address, password, custom tasks, note documents, and circular workspace structures.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono">02</span>
                How We Process AI Data
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  TaskMate AI prioritizes local-first data processing. When you record a voice note, transcriptions are optimized to run on device-level intelligence.
                </p>
                <p>
                  Metadata and historical patterns used to surface smart task suggestions are processed locally to maintain data confidentiality.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F0607A]/20 flex items-center justify-center text-[#F0607A] text-sm font-mono">03</span>
                Calendar Integration
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  When using our Google Calendar Task Manager synchronization, we request permissions solely to read and write your calendar tasks. Your synchronized calendar tokens are encrypted at rest and never shared with third-party advertising platforms.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F5A87B]/20 flex items-center justify-center text-[#F5A87B] text-sm font-mono">04</span>
                Cookies & Web Analytics
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  We use functional cookies to retain your workspace session context, interface theme, and default task settings. Aggregate usage data is tracked anonymously via Google Analytics and Microsoft Clarity to optimize our Core Web Vitals.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#8B65C8]/20 flex items-center justify-center text-[#C4B8E8] text-sm font-mono">05</span>
                Data Retention & Control
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  We store your data for as long as your account remains active. You may delete your account and associated task lists at any time by navigating to your Account Settings interface.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono">06</span>
                Contact Information
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  For privacy-related inquiries or data requests, please contact us at:{' '}
                  <a href="mailto:ck.futuretech@gmail.com" className="text-[#4ABFB8] hover:underline font-bold">
                    ck.futuretech@gmail.com
                  </a>.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
