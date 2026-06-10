import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Mic, Sparkles, Target, Check, Calendar, Play, Pause, Square } from 'lucide-react';

const HowItWorksSection = () => {
  const { theme } = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: 'Capture your thoughts',
      description: 'Add tasks instantly via voice or natural language. TaskMate extracts the context automatically.',
    },
    {
      number: 2,
      title: 'AI Daily Optimization',
      description: 'Our engine sorts your tasks by priority and energy cycles to build your ideal daily agenda.',
    },
    {
      number: 3,
      title: 'Focus and Execute',
      description: 'Enter deep work mode, knock out your tasks, and watch your productivity stats climb.',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-[var(--aurora-bg-primary)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Column: Interactive Steps */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-[var(--aurora-text-primary)]">Simple steps to 10x your output</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-8 rounded-3xl border transition-all flex items-start gap-6 group ${
                    activeStep === i
                      ? 'bg-[var(--aurora-bg-secondary)] border-[#8B65C8] shadow-lg transform translate-x-2'
                      : 'bg-transparent border-[var(--aurora-border)] hover:bg-[var(--aurora-bg-secondary)]/50'
                  }`}
                  style={{
                    boxShadow: activeStep === i ? '0 10px 40px -10px var(--aurora-glow-purple)' : 'none',
                  }}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                    activeStep === i
                      ? 'bg-[#8B65C8] text-white'
                      : 'bg-white/5 text-[var(--aurora-text-primary)] group-hover:bg-[#8B65C8] group-hover:text-white'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className={`text-xl font-extrabold mb-2 transition-colors ${
                      activeStep === i ? 'text-[#8B65C8] dark:text-[#C4C8E8]' : 'text-[var(--aurora-text-primary)]'
                    }`}>{step.title}</h3>
                    <p className="text-[var(--aurora-text-secondary)] text-sm">{step.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Demonstration Panel */}
          <div>
            <div className="bg-[var(--aurora-bg-secondary)] border border-[var(--aurora-border)] rounded-[2.5rem] p-12 min-h-[500px] flex items-center justify-center shadow-2xl relative overflow-hidden">
              
              {/* Panel 0: Voice Capture Panel */}
              {activeStep === 0 && (
                <div className="w-full max-w-md animate-fade-in">
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-8 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-end gap-1.5 h-12">
                        <div className="aurora-wave-bar" style={{ '--peak': '30px', animationDelay: '0s' } as React.CSSProperties}></div>
                        <div className="aurora-wave-bar" style={{ '--peak': '50px', animationDelay: '0.1s' } as React.CSSProperties}></div>
                        <div className="aurora-wave-bar" style={{ '--peak': '40px', animationDelay: '0.2s' } as React.CSSProperties}></div>
                        <div className="aurora-wave-bar" style={{ '--peak': '60px', animationDelay: '0.3s' } as React.CSSProperties}></div>
                        <div className="aurora-wave-bar" style={{ '--peak': '25px', animationDelay: '0.4s' } as React.CSSProperties}></div>
                        <div className="aurora-wave-bar" style={{ '--peak': '45px', animationDelay: '0.5s' } as React.CSSProperties}></div>
                      </div>
                      <span className="text-[#8B65C8] text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#8B65C8] animate-ping"></span> Listening...
                      </span>
                    </div>
                    <p className="text-lg font-medium italic opacity-90 leading-relaxed text-[var(--aurora-text-primary)]">
                      "Hey TaskMate, schedule a 15-minute sync with the design team for tomorrow at 2 PM."
                    </p>
                  </div>
                  <div className="bg-[#8B65C8]/10 border border-[#8B65C8]/20 rounded-2xl p-6 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-lg bg-[#8B65C8] flex items-center justify-center text-white">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--aurora-text-primary)]">Task added: Design Sync</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#8B65C8] font-bold">Tomorrow, 2:00 PM</p>
                      </div>
                    </div>
                    <Check className="text-[#4ABFB8] w-6 h-6" />
                  </div>
                </div>
              )}

              {/* Panel 1: AI Daily Schedule Panel */}
              {activeStep === 1 && (
                <div className="w-full max-w-md animate-fade-in text-left">
                  <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--aurora-text-primary)]">
                      <Sparkles className="text-[#F0607A] w-5 h-5" /> AI Daily Schedule
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="text-[10px] font-bold text-[var(--aurora-text-muted)] w-12 text-right">09:00</div>
                        <div className="flex-1 bg-[#4ABFB8]/10 border-l-4 border-[#4ABFB8] p-3 rounded-r-xl">
                          <p className="text-xs font-bold text-[var(--aurora-text-primary)]">Deep Work: App Logic</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center opacity-60">
                        <div className="text-[10px] font-bold text-[var(--aurora-text-muted)] w-12 text-right">11:30</div>
                        <div className="flex-1 bg-[#8B65C8]/10 border-l-4 border-[#8B65C8] p-3 rounded-r-xl">
                          <p className="text-xs font-bold text-[var(--aurora-text-primary)]">Design Sync</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="text-[10px] font-bold text-[var(--aurora-text-muted)] w-12 text-right">14:00</div>
                        <div className="flex-1 bg-[#F0607A]/10 border-l-4 border-[#F0607A] p-3 rounded-r-xl">
                          <p className="text-xs font-bold text-[var(--aurora-text-primary)]">Inbox Zero</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Panel 2: Focus / Timer Panel */}
              {activeStep === 2 && (
                <div className="text-center animate-fade-in">
                  <div className="inline-block relative mb-8">
                    <svg className="w-48 h-48 -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="8" fill="transparent" className="text-white/5" />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        stroke="currentColor" 
                        stroke-width="8" 
                        fill="transparent" 
                        strokeDasharray="552.9" 
                        strokeDashoffset="138" 
                        className="text-[#8B65C8]" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--aurora-text-primary)]">
                      <span className="text-4xl font-black">24:59</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Focusing</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--aurora-text-primary)] hover:bg-white/10 transition-colors">
                      <Pause className="w-5 h-5 fill-current" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors">
                      <Square className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
