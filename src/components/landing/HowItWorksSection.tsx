import { useState } from 'react';
import { Mic, Sparkles, Target, Check, Calendar, Pause, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorksSection = () => {
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

  const panelVariants = {
    initial: { opacity: 0, scale: 0.95, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.95, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <section id="how-it-works" className="py-24 bg-slate-50/50 dark:bg-[#05020c]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Interactive Steps */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-extrabold mb-10 text-slate-900 dark:text-white uppercase tracking-tight"
            >
              Simple steps to 10x your output
            </motion.h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full text-left p-6 rounded-3xl border transition-all flex items-start gap-6 group cursor-pointer ${
                    activeStep === i
                      ? 'bg-white dark:bg-slate-950/80 border-[#8B65C8] dark:border-[#8B65C8] shadow-xs'
                      : 'bg-transparent border-slate-200 dark:border-white/5 hover:bg-white/40 dark:hover:bg-slate-950/20'
                  }`}
                >
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                    activeStep === i
                      ? 'bg-gradient-to-br from-[#F0607A] to-[#8B65C8] text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 group-hover:bg-[#8B65C8] group-hover:text-white'
                  }`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold mb-2 transition-colors ${
                      activeStep === i ? 'text-[#8B65C8] dark:text-[#C4B8E8]' : 'text-slate-900 dark:text-white'
                    }`}>{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">{step.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Demonstration Panel */}
          <div>
            <div className="bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 min-h-[460px] flex items-center justify-center shadow-xs relative overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* Panel 0: Voice Capture Panel */}
                {activeStep === 0 && (
                  <motion.div 
                    key="voice"
                    variants={panelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full max-w-md text-left"
                  >
                    <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 mb-6 backdrop-blur-xs">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-end gap-1.5 h-8">
                          {/* Animated Voice Bars */}
                          {[1, 2, 3, 4, 5, 6].map((bar, idx) => (
                            <motion.div 
                              key={idx}
                              animate={{ height: [8, Math.random() * 30 + 10, 8] }}
                              transition={{ duration: 0.8 + idx * 0.1, repeat: Infinity, ease: "easeInOut" }}
                              className="w-[3px] bg-[#8B65C8] rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-[#8B65C8] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 font-mono">
                          <span className="w-2 h-2 rounded-full bg-[#8B65C8] animate-ping"></span> Listening...
                        </span>
                      </div>
                      <p className="text-base font-medium italic text-slate-800 dark:text-slate-200 leading-relaxed">
                        "Hey TaskMate, schedule a 15-minute sync with the design team for tomorrow at 2 PM."
                      </p>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-[#8B65C8]/5 border border-[#8B65C8]/10 rounded-2xl p-6 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-[#8B65C8] flex items-center justify-center text-white">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Task added: Design Sync</p>
                          <p className="text-[10px] uppercase tracking-widest text-[#8B65C8] font-bold">Tomorrow, 2:00 PM</p>
                        </div>
                      </div>
                      <Check className="text-[#4ABFB8] w-6 h-6" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Panel 1: AI Daily Schedule Panel */}
                {activeStep === 1 && (
                  <motion.div 
                    key="schedule"
                    variants={panelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full max-w-md text-left"
                  >
                    <div className="bg-slate-50/80 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200/60 dark:border-white/5 backdrop-blur-xs">
                      <h4 className="text-base font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Sparkles className="text-[#F0607A] w-5 h-5" /> AI Daily Schedule
                      </h4>
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex gap-4 items-center"
                        >
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-12 text-right">09:00</div>
                          <div className="flex-1 bg-[#4ABFB8]/5 border-l-4 border-[#4ABFB8] p-3 rounded-r-xl">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Deep Work: App Logic</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-4 items-center opacity-60"
                        >
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-12 text-right">11:30</div>
                          <div className="flex-1 bg-[#8B65C8]/5 border-l-4 border-[#8B65C8] p-3 rounded-r-xl">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Design Sync</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex gap-4 items-center"
                        >
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-12 text-right">14:00</div>
                          <div className="flex-1 bg-[#F0607A]/5 border-l-4 border-[#F0607A] p-3 rounded-r-xl">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Inbox Zero</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Panel 2: Focus / Timer Panel */}
                {activeStep === 2 && (
                  <motion.div 
                    key="timer"
                    variants={panelVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-center"
                  >
                    <div className="inline-block relative mb-8">
                      <svg className="w-40 h-40 -rotate-90">
                        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-white/5" />
                        <motion.circle 
                          cx="80" 
                          cy="80" 
                          r="72" 
                          stroke="currentColor" 
                          strokeWidth="6" 
                          fill="transparent" 
                          strokeDasharray="452.3" 
                          initial={{ strokeDashoffset: 452.3 }}
                          animate={{ strokeDashoffset: 113 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="text-[#8B65C8]" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 dark:text-white">
                        <span className="text-3xl font-black">24:59</span>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Focusing</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Pause className="w-4 h-4 fill-current" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
