import React from 'react';
import SEO from '@/components/SEO';
import LandingNav from '@/components/landing/LandingNav';
import Footer from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Award, AlertTriangle, Scale, Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Terms = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative bg-[#05020c] text-slate-200 transition-colors duration-500 font-sans">
      <SEO 
        title="Terms of Service - TaskMate AI"
        description="TaskMate AI Terms of Service. Review the conditions, software licenses, calendar integration usage, and operational policies."
      />
      
      <LandingNav />

      {/* Decorative Blob */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#8B65C8]/10 via-[#4ABFB8]/0 to-transparent blur-[120px] pointer-events-none" />

      <main className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 shadow-sm">
            <Scale className="w-4 h-4 text-[#F5A87B]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4B8E8] font-mono">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xs text-[#8B65C8] font-mono uppercase tracking-widest">
            Last Updated: June 24, 2026
          </p>
        </div>

        <Card className={cn(
          "rounded-[3rem] border overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#8B65C8]/30 mb-16",
          theme === 'dark' 
            ? "bg-slate-955/40 border-white/5 backdrop-blur-xl" 
            : "bg-slate-955/60 border-white/5 backdrop-blur-xl"
        )}>
          <CardContent className="p-8 sm:p-12 text-left space-y-10">
            
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#8B65C8]/20 flex items-center justify-center text-[#C4B8E8] text-sm font-mono">01</span>
                Agreement to Terms
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  By accessing or using the TaskMate AI applications, web portal, or local services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono">02</span>
                Description of Service
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  TaskMate AI is a smart to-do application, daily planner, and calendar synchronization software. We offer standard productivity tools free of charge, with premium upgrades available for advanced AI agent processing and high-frequency group sync capacities.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F0607A]/20 flex items-center justify-center text-[#F0607A] text-sm font-mono">03</span>
                Account Integrity
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  You are responsible for safeguarding your access credentials and for all operations performed under your session. If you detect unauthorized access to your account, you must alert support immediately.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F5A87B]/20 flex items-center justify-center text-[#F5A87B] text-sm font-mono">04</span>
                Intellectual Property
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  TaskMate AI, its original features, and brand designs are owned by Chirag Mali and are protected by applicable intellectual property regulations. You may not distribute or copy our software code without permission.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#8B65C8]/20 flex items-center justify-center text-[#C4B8E8] text-sm font-mono">05</span>
                Disclaimer of Warranties
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. TaskMate AI makes no guarantees regarding the uninterrupted availability, response speed, or zero-loss integrity of synced data.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono">06</span>
                Governing Law
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  These Terms of Service shall be governed by and interpreted in accordance with state and national regulations, excluding its conflicts of law parameters.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F0607A]/20 flex items-center justify-center text-[#F0607A] text-sm font-mono">07</span>
                Support Inquiries
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed">
                <p>
                  Please address all service queries or compliance notices to:{' '}
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

export default Terms;
