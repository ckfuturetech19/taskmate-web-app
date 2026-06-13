import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Play, Mic, Target } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import dashboardDarkImg from '@/assets/dashboardDark.png';
import dashboardLightImg from '@/assets/dashboardLight.png';

const SplitText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: "110%",
    },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="visible"
      className="inline-block overflow-hidden"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          className="inline-block"
          style={{ display: "inline-block", whiteSpace: "pre" }}
          key={index}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

const HeroSection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dashboardImage = theme === 'dark' ? dashboardDarkImg : dashboardLightImg;

  const words = ['Live better.', 'Focus deeper.', 'Sync faster.', 'Build smarter.'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const mockupRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mockupRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [10, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0.2, 1]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: custom * 0.1,
      },
    }),
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-transparent">
      {/* Ambient background blur */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#8B65C8]/5 via-[#4ABFB8]/0 to-transparent blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10 max-w-7xl">
        
        {/* Version Badge */}
        <motion.div 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8 backdrop-blur-xs shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#4ABFB8] animate-pulse shadow-[0_0_8px_#4ABFB8]"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            AI-Powered Task Intelligence · v1.7.0
          </span>
        </motion.div>

        {/* Hero Title */}
        <h1 
          className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 leading-[1.05] tracking-tight uppercase text-slate-900 dark:text-white"
        >
          <SplitText text="Plan smarter." delay={0.15} /><br />
          <span className="relative inline-block overflow-hidden h-[1.15em] w-full pt-1">
            <AnimatePresence mode="wait">
              <motion.span 
                key={wordIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gradient-to-r from-[#F5A87B] via-[#F0607A] to-[#8B65C8] bg-clip-text text-transparent absolute left-0 right-0"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Hero Description */}
        <motion.p 
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-10 leading-relaxed"
        >
          Harness the power of AI to organize your life. From voice-captured thoughts to auto-scheduled days, TaskMate AI is your ultimate productivity partner.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button 
            onClick={() => navigate('/auth')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white text-xs uppercase font-extrabold tracking-widest rounded-full shadow-lg shadow-[#F0607A]/20 transition-all cursor-pointer relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
            Get Started Free
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-white text-xs uppercase font-extrabold tracking-widest rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" /> Watch Demo
          </motion.button>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div 
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-8 mb-20 text-slate-500 dark:text-slate-400"
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-lg">🤖</span> Android Live
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
            <span className="text-lg">🍎</span> iOS Soon
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-lg">🌐</span> Web App
          </div>
        </motion.div>

        {/* Flat Modern Dashboard Mockup Frame with scroll reveal */}
        <motion.div 
          ref={mockupRef}
          style={{
            scale,
            rotateX,
            opacity,
            transformPerspective: 1200,
          }}
          className="max-w-5xl mx-auto px-4"
        >
          <div className="relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/60 shadow-lg p-2 transition-all duration-300">
            <div className="w-full bg-slate-100 dark:bg-[#0b0e14] rounded-2xl overflow-hidden relative aspect-[16/10] border border-slate-200/50 dark:border-white/5">
              
              {/* Window Controls */}
              <div className="absolute top-4 left-6 flex gap-2 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
              </div>
              
              {/* Dashboard Image */}
              <img 
                src={dashboardImage} 
                alt="TaskMate Dashboard" 
                className="w-full h-full object-cover opacity-90 dark:opacity-85"
              />

              {/* Interactive Floating Widgets */}
              {/* Left Widget: Voice Capture */}
              <motion.div 
                drag
                dragConstraints={{ left: -10, right: 300, top: -10, bottom: 200 }}
                whileHover={{ scale: 1.05, cursor: "grab" }}
                whileTap={{ cursor: "grabbing" }}
                className="absolute top-[15%] left-[2%] z-30 hidden lg:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-white/10 p-4 rounded-2xl shadow-lg flex items-center gap-4 text-left select-none">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0607A] to-[#8B65C8] flex items-center justify-center text-white shadow-xs">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8B65C8] dark:text-[#C4B8E8]">Voice Capturing</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">"Schedule sync with devs..."</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Widget: Deep Work Focus */}
              <motion.div 
                drag
                dragConstraints={{ left: -300, right: 10, top: -50, bottom: 200 }}
                whileHover={{ scale: 1.05, cursor: "grab" }}
                whileTap={{ cursor: "grabbing" }}
                className="absolute bottom-[20%] right-[2%] z-30 hidden lg:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-white/10 p-4 rounded-2xl shadow-lg flex items-center gap-4 text-left select-none">
                  <div className="w-10 h-10 rounded-xl bg-[#4ABFB8]/20 text-[#4ABFB8] flex items-center justify-center shadow-xs border border-[#4ABFB8]/10">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#4ABFB8]">Deep Work Active</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Focus Timer: 42:15</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
