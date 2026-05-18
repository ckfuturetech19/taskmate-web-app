import dashboardDarkImg from '@/assets/dashboardDark.png';
import dashboardLightImg from '@/assets/dashboardLight.png';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const CTASection = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dashboardImage = theme === 'dark' ? dashboardDarkImg : dashboardLightImg;

  return (
    <section className={cn(
      "py-24 md:py-48 px-4 relative overflow-hidden transition-colors duration-700 bg-transparent"
    )}>
      {/* Optimized Auras - Lightweight for Mobile */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[150px] bg-primary/5 pointer-events-none",
        window.innerWidth > 768 ? "animate-pulse-slow" : "opacity-30"
      )} />

      <div className="container mx-auto max-w-7xl relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-16"
        >
          <div className={cn(
            "h-28 w-28 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 relative overflow-hidden",
            theme === 'dark' ? "bg-primary/5 border border-primary/20" : "bg-white border border-primary/20 shadow-primary/10"
          )}>
            <Sparkles className={cn("h-14 w-14 text-primary", window.innerWidth > 768 && "animate-pulse")} />
          </div>

          <h2 className={cn(
            "text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-tight pb-10 max-w-7xl mx-auto transition-colors",
            theme === 'dark' ? "text-white" : "text-black"
          )}>
            READY TO <span className="text-gradient">SYNC</span><br />
            YOUR LIFE?
          </h2>

          <p className={cn(
            "text-lg md:text-2xl max-w-2xl mx-auto font-bold uppercase tracking-[0.4em] transition-colors",
            theme === 'dark' ? "text-white/40" : "text-black/40"
          )}>
            Join 50,000+ creators architecting the future of unified productivity on TaskMate.
          </p>

          <div className="flex flex-col sm:flex-row gap-10 items-center w-full sm:w-auto">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full h-20 px-16 bg-primary text-black font-black uppercase text-[12px] tracking-[0.4em] rounded-full hover:scale-105 hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] active:scale-95 transition-all shadow-2xl"
            >
              START FREE NOW
            </button>
            <button className={cn(
              "w-full h-20 px-16 glass font-black uppercase text-[12px] tracking-[0.4em] rounded-full border transition-all active:scale-95",
              theme === 'dark' ? "text-white border-white/10 hover:bg-white/5" : "text-black border-black/10 hover:bg-black/5"
            )}>
              MOBILE APP
            </button>
          </div>
        </motion.div>

        {/* Active Dashboard Reveal - Optimized Transformations */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-48 relative max-w-7xl mx-auto perspective-[2000px]"
        >
          <div className={cn(
            "rounded-2xl overflow-hidden border p-3 group preserve-3d transition-all duration-700",
            theme === 'dark' 
              ? "shadow-2xl border-white/10 bg-black/40" 
              : "shadow-2xl border-black/5 bg-white"
          )}>
            <img 
              src={dashboardImage}
              alt="TaskMate Ecosystem"
              className="w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-1000 rounded-xl"
            />
            {/* Glossy Active Overlay - Desktop Only */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden md:block" />
          </div>
          
          {/* Bottom Active Glow - Optimized */}
          <div className={cn(
            "absolute -bottom-40 left-1/2 -translate-x-1/2 w-[90%] h-96 bg-primary/10 blur-[200px] -z-10 rounded-full",
            window.innerWidth > 768 ? "animate-pulse-slow" : "opacity-30"
          )} />
        </motion.div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default CTASection;
