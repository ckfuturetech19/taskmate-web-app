import React from 'react';
import SEO from '@/components/SEO';
import LandingNav from '@/components/landing/LandingNav';
import Footer from '@/components/landing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Lightbulb, Target, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const About = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden relative bg-[#05020c] text-slate-200 transition-colors duration-500 font-sans">
      <SEO 
        title="About Us - TaskMate AI"
        description="Learn more about TaskMate AI, our mission to transform productivity with smart local neural processing, and Chirag Mali."
      />
      
      <LandingNav />

      {/* Decorative Blob */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#8B65C8]/10 via-[#4ABFB8]/0 to-transparent blur-[120px] pointer-events-none" />

      <main className="relative z-10 pt-32 pb-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 shadow-sm">
            <Users className="w-4 h-4 text-[#4ABFB8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C4B8E8] font-mono">
              Our Story & Mission
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            About TaskMate AI
          </h1>
          <p className="text-xs text-[#8B65C8] font-mono uppercase tracking-widest">
            Reimagining Productivity for the AI Era
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
                <span className="w-8 h-8 rounded-lg bg-[#8B65C8]/20 flex items-center justify-center text-[#C4B8E8] text-sm font-mono"><Lightbulb className="w-4 h-4 text-[#C4B8E8]" /></span>
                The Vision
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  TaskMate AI was founded with a singular purpose: to build a productivity system that works as a cognitive extension. Traditional task managers force you to manually organize details, manage calendars, and set reminders, introducing unnecessary cognitive load.
                </p>
                <p>
                  We believe technology should adapt to your schedule, energy level, and workflow. By using local intelligence models, TaskMate AI surfaces actions, voice transcripts, and contextual reminders automatically.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono"><Target className="w-4 h-4 text-[#4ABFB8]" /></span>
                Developed by Chirag Mali
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  TaskMate AI is built and maintained by <strong>Chirag Mali</strong>, dedicated to designing next-generation business tools, real-time databases, and interactive AI software.
                </p>
                <p>
                  Our office is based in Ahmedabad, India. We are passionate about creating software that prioritizes user speed, elegant visual aesthetics, and local-first data integrity.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F0607A]/20 flex items-center justify-center text-[#F0607A] text-sm font-mono"><Sparkles className="w-4 h-4 text-[#F0607A]" /></span>
                Core Principles
              </h2>
              <div className="pl-11 text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  <strong>Local Intelligence first:</strong> Transcribe voice entries and organize daily schedules locally on your hardware to respect your absolute privacy constraints.
                </p>
                <p>
                  <strong>Seamless Integration:</strong> Synchronize with systems like Google Calendar and real-time team circle notifications to stay aligned effortlessly.
                </p>
                <p>
                  <strong>Vibrant Design Aesthetics:</strong> Combine dynamic layouts, responsive dark modes, and premium glassmorphism interfaces to make daily planning an engaging experience.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#F5A87B]/20 flex items-center justify-center text-[#F5A87B] text-sm font-mono">✓</span>
                Perfect For
              </h2>
              <ul className="pl-11 text-slate-400 text-sm space-y-2 list-disc list-inside">
                <li><strong>Students</strong> managing classes, assignments, and exams</li>
                <li><strong>Professionals</strong> tracking work projects and deliverables</li>
                <li><strong>Freelancers</strong> organizing client tasks and deadlines</li>
                <li><strong>Families</strong> managing chores and shared responsibilities</li>
                <li><strong>Habit Builders</strong> creating productive daily routines</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#4ABFB8]/20 flex items-center justify-center text-[#4ABFB8] text-sm font-mono">★</span>
                Why Choose TaskMate?
              </h2>
              <div className="pl-11 text-slate-400 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Tasks, Notes & Life Milestones in one place</li>
                  <li>Voice input, calendar sync & widgets</li>
                  <li>Personal and Group Collaboration</li>
                  <li>Smart recurring reminders</li>
                  <li>AI-powered productivity tools</li>
                  <li>Clean, responsive, fast UI</li>
                </ul>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Multiple themes and customization</li>
                  <li>Cloud backup with offline-first support</li>
                  <li>Lightweight and battery-friendly</li>
                  <li>Cross-platform sync (Mobile & Web)</li>
                  <li>Support & Feedback Center</li>
                  <li>Completely free with powerful features</li>
                </ul>
              </div>
            </section>

          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default About;
