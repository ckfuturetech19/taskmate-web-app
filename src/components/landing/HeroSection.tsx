import dashboardDarkImg from '@/assets/dashboardDark.png';
import dashboardLightImg from '@/assets/dashboardLight.png';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';

const Typewriter = ({ text, delay = 0, className }: { text: string, delay?: number, className?: string }) => {
  return (
    <motion.span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: delay + (i * 0.05),
            ease: "linear"
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[0.5em] h-[1em] bg-primary align-middle ml-1"
      />
    </motion.span>
  );
};

const HeroSection = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const scrollRotateX = useTransform(smoothProgress, [0, 0.5], [15, 0]);
  const scrollScale = useTransform(smoothProgress, [0, 0.5], [0.85, 1]);
  const scrollOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);

  const dashboardImage = theme === 'dark' ? dashboardDarkImg : dashboardLightImg;

  return (
    <section 
      id="home" 
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex items-center pt-32 pb-24 md:pb-40 px-4 overflow-hidden transition-colors duration-700 bg-transparent"
      )}
    >
      {/* Sexy Noise Texture Overlay */}
      <div className="absolute inset-0 z-[2] bg-noise opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          {/* Active Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "group cursor-pointer mb-12 p-[1px] rounded-full bg-gradient-to-r from-primary via-secondary to-primary shadow-2xl",
              theme === 'dark' ? "shadow-primary/20" : "shadow-primary/10"
            )}
          >
            <div className={cn(
              "px-8 py-3 rounded-full backdrop-blur-2xl flex items-center gap-4 transition-all duration-500 hover:bg-opacity-50",
              theme === 'dark' ? "bg-black/80" : "bg-white/90"
            )}>
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_#22d3ee] animate-pulse" />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] transition-colors",
                theme === 'dark' ? "text-white" : "text-black/60"
              )}>Circle Mesh v2.0 // Active Node</span>
              <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Sexy Title Block */}
          <div className="relative mb-12">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black leading-tight tracking-tighter transition-colors pb-8",
                theme === 'dark' ? "text-white" : "text-black"
              )}
            >
              FUTURE<br />
              <Typewriter 
                text="TASKMATE" 
                delay={1} 
                className="text-gradient drop-shadow-[0_0_60px_rgba(34,211,238,0.3)]" 
              />
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              "text-xl md:text-3xl max-w-3xl mx-auto mb-20 font-bold leading-relaxed transition-colors",
              theme === 'dark' ? "text-white/40" : "text-black/40"
            )}
          >
            Unified personal tasks, collaborative rich notes, and group circles. Synchronized in real-time across your web terminal and mobile ecosystem.
          </motion.p>

          {/* Action Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-10 items-center"
          >
            <button 
              onClick={() => navigate('/auth')}
              className="h-20 px-16 bg-primary text-black font-black uppercase text-[13px] tracking-[0.4em] rounded-full hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all shadow-2xl"
            >
              INITIALIZE FREE
            </button>
            
            <button className={cn(
              "h-20 px-16 glass font-black uppercase text-[13px] tracking-[0.4em] rounded-full border transition-all flex items-center gap-5",
              theme === 'dark' ? "text-white border-white/10 hover:bg-white/5" : "text-black border-black/10 hover:bg-black/5"
            )}>
              <Play className="h-5 w-5 fill-primary text-primary" />
              <span>EXPERIENCE</span>
            </button>
          </motion.div>
        </div>

        {/* Static Dashboard Preview - Performance Optimized */}
        <div className="relative mt-24 px-4 max-w-7xl mx-auto">
          <motion.div
            style={{ 
              rotateX: window.innerWidth > 768 ? scrollRotateX : 0, 
              scale: window.innerWidth > 768 ? scrollScale : 1, 
              opacity: scrollOpacity 
            }}
            className="relative z-10"
          >
            <div className={cn(
              "relative rounded-2xl overflow-hidden border p-3 shadow-2xl transition-all",
              theme === 'dark' 
                ? "border-white/10 bg-black/40 shadow-black/20" 
                : "border-black/5 bg-white shadow-black/10"
            )}>
              <div className={cn(
                "rounded-xl overflow-hidden relative group",
                theme === 'dark' ? "bg-black/60" : "bg-gray-50"
              )}>
                <img 
                   src={dashboardImage}
                   alt="TaskMate Interface"
                   className="w-full h-auto opacity-95 transition-opacity duration-1000"
                />
              </div>
            </div>

            {/* Core Glow - Static on mobile for performance */}
            <div className={cn(
              "absolute -bottom-40 left-1/2 -translate-x-1/2 w-[95%] h-80 bg-primary/20 blur-[200px] -z-10 rounded-full",
              window.innerWidth > 768 ? "animate-pulse-slow" : "opacity-50"
            )} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default HeroSection;
