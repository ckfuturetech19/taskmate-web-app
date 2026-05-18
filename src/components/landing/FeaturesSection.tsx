import { Link } from 'react-router-dom';
import { Target, Layers, Share2, Zap, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
  const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 1, 
        delay: feature.delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ rotateX: isMobile ? 0 : rotateX, rotateY: isMobile ? 0 : rotateY }}
      className="group preserve-3d cursor-tracking-card"
    >
      <div className={cn(
        "h-full p-10 border transition-all duration-700 flex flex-col justify-between min-h-[400px] md:min-h-[480px] relative overflow-hidden rounded-[2.5rem]",
        theme === 'dark' 
          ? "bg-black/40 border-white/5 hover:border-primary/40 glow-primary/5 shadow-2xl" 
          : "bg-white border-black/5 hover:border-primary/20 shadow-xl shadow-black/5"
      )}>
        <div className="absolute inset-0 z-0 bg-noise opacity-[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden md:block" />
        
        <div className="relative z-10">
          <div className={cn(
            "h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center mb-8 md:mb-12 transition-all duration-700 relative",
            theme === 'dark' ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-black/5"
          )}>
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            <feature.icon className={cn("h-6 w-6 md:h-8 md:w-8 relative z-10 transition-colors", feature.color)} />
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <div className={cn("h-1.5 w-1.5 rounded-full", feature.color.replace('text-', 'bg-'))} />
              <span className={cn("text-[10px] font-black uppercase tracking-[0.3em]", theme === 'dark' ? "text-white/40" : "text-black/50")}>
                {feature.tag}
              </span>
            </div>
            <h3 className={cn(
              "text-2xl md:text-3xl font-black tracking-tighter leading-none transition-colors",
              theme === 'dark' ? "text-white" : "text-black"
            )}>
              {feature.title}
            </h3>
            <p className={cn(
              "text-xs md:text-sm font-bold leading-relaxed transition-colors",
              theme === 'dark' ? "text-white/40" : "text-black/50"
            )}>
              {feature.description}
            </p>
          </div>
        </div>

        <div className="mt-8 md:mt-12 relative z-10 flex items-center justify-between border-t pt-6 md:pt-8 border-white/5">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">NODE.0{index + 1}</span>
          <div className={cn(
            "h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center border transition-all duration-500",
            theme === 'dark' ? "border-white/10 text-white/40 group-hover:bg-primary group-hover:text-black group-hover:border-primary" : "border-black/10 text-black/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
          )}>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const features = [
  {
    icon: Target,
    tag: 'PILLAR 01',
    title: 'TASK ENGINE',
    description: 'Manage personal and group tasks with intelligent owner assignment, real-time status telemetry, and automated reminders.',
    color: 'text-primary',
    delay: 0.1
  },
  {
    icon: Layers,
    tag: 'PILLAR 02',
    title: 'NOTE LAYERING',
    description: 'Collaborative rich-text documentation. Create checklists, format complex thoughts, and share insights within your circle hubs.',
    color: 'text-secondary',
    delay: 0.2
  },
  {
    icon: Share2,
    tag: 'PILLAR 03',
    title: 'CIRCLE LOGIC',
    description: 'Private mesh networking for family, friends, or work teams. Distribute directives instantly and maintain perfect group alignment.',
    color: 'text-emerald-400',
    delay: 0.3
  },
  {
    icon: Zap,
    tag: 'PILLAR 04',
    title: 'NEURAL SYNC',
    description: 'Zero-latency propagation. Your tasks, notes, and circles are mirrored instantly across iOS, Android, and Web endpoints.',
    color: 'text-amber-400',
    delay: 0.4
  }
];

const FeaturesSection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <section id="features" ref={sectionRef} className={cn(
      "py-24 md:py-48 px-4 relative overflow-hidden transition-colors duration-700 bg-transparent"
    )}>
      {/* Antigravity Spotlight Overlay - Disabled on Mobile */}
      {!isMobile && (
        <motion.div 
          style={{ 
            left: springX, 
            top: springY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className={cn(
            "absolute w-[800px] h-[800px] pointer-events-none z-0 blur-[120px] rounded-full opacity-40",
            theme === 'dark' ? "bg-primary/20" : "bg-primary/10"
          )}
        />
      )}

      {/* Sharp Grid Architecture */}
      <div className="absolute inset-0 z-0">
        <div className={cn(
          "absolute inset-0",
          theme === 'dark' 
            ? "bg-grid-pattern opacity-[0.05]" 
            : "bg-[radial-gradient(circle,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"
        )} />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b",
          theme === 'dark' ? "from-black via-transparent to-black" : "from-white via-transparent to-white"
        )} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-start mb-24 md:mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[2px] w-16 bg-primary shadow-[0_0_15px_#22d3ee]" />
            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary">CORE ARCHITECTURE</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "text-6xl md:text-[9rem] font-black mb-10 leading-[0.8] tracking-tighter transition-colors",
              theme === 'dark' ? "text-white" : "text-black"
            )}
          >
            THE NEW<br />
            <span className={theme === 'dark' ? "text-white/10" : "text-black/5"}>STRENGTH</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-[2000px]">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default FeaturesSection;
