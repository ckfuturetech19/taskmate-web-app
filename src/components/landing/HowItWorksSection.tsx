import { Share2, ChevronRight, LayoutDashboard, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const steps = [
  {
    icon: LayoutDashboard,
    tag: 'PROTOCOL 01',
    title: 'PERSONAL HUB',
    description: 'Establish your private base. Create personal nodes for tasks and notes, tailored to your individual cognitive flow.',
    delay: 0.1
  },
  {
    icon: Share2,
    tag: 'PROTOCOL 02',
    title: 'CIRCLE MESH',
    description: 'Expand to your circles. Form private groups for teams, family, or friends and distribute directives in real-time.',
    delay: 0.2
  },
  {
    icon: Globe2,
    tag: 'PROTOCOL 03',
    title: 'GLOBAL SYNC',
    description: 'Zero data variance. Your workspace is instantly propagated across all web and mobile endpoints via our neural sync.',
    delay: 0.3
  }
];

const HowItWorksSection = () => {
  const { theme } = useTheme();

  return (
    <section id="how-it-works" className={cn(
      "py-24 md:py-48 px-4 relative overflow-hidden transition-colors duration-700",
      theme === 'dark' ? "bg-transparent" : "bg-gray-50/30"
    )}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12"
          >
            System Deployment
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-6xl md:text-[11rem] font-black mb-10 leading-[0.8] tracking-tighter transition-colors",
              theme === 'dark' ? "text-white" : "text-black"
            )}
          >
            SYSTEM<br />
            <span className={theme === 'dark' ? "text-white/10" : "text-black/5"}>FLOW</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-32 relative perspective-[2000px]">
          {/* Active Neural Connector Line */}
          <div className={cn(
            "absolute top-[20%] left-0 w-full h-[1px] hidden md:block",
            theme === 'dark' ? "bg-white/5" : "bg-black/5"
          )} />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1, 
                delay: step.delay,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center space-y-16">
                <div className="relative">
                  {/* Active Step Core */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "h-40 w-40 md:h-48 md:w-48 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl relative overflow-hidden",
                      theme === 'dark' 
                        ? "bg-black/60 border border-primary/20 glow-primary" 
                        : "bg-white border border-primary/10 shadow-xl shadow-black/5"
                    )}
                  >
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <step.icon className={cn(
                      "h-16 w-16 md:h-20 md:w-20 transition-all duration-700 relative z-10",
                      theme === 'dark' ? "text-primary/80 group-hover:text-primary" : "text-primary/60 group-hover:text-primary"
                    )} />
                  </motion.div>
                  
                  {/* Active Step Number */}
                  <div className={cn(
                    "absolute -top-4 -right-4 h-14 w-14 rounded-2xl border flex items-center justify-center text-[12px] font-black text-primary shadow-2xl transition-all duration-700 group-hover:scale-110",
                    theme === 'dark' ? "bg-black border-primary/40 glow-primary" : "bg-white border-primary/40 shadow-lg shadow-black/5"
                  )}>
                    0{index + 1}
                  </div>
                </div>

                <div className="space-y-8">
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] block">
                    {step.tag}
                  </span>
                  <h3 className={cn(
                    "text-5xl font-black tracking-tighter leading-none transition-colors",
                    theme === 'dark' ? "text-white" : "text-black"
                  )}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-base font-bold leading-relaxed max-w-[320px] mx-auto transition-colors",
                    theme === 'dark' ? "text-white/40" : "text-black/60"
                  )}>
                    {step.description}
                  </p>
                </div>

                <button className={cn(
                  "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 group/btn border",
                  theme === 'dark' 
                    ? "bg-white/5 border-white/10 text-white hover:bg-primary hover:text-black hover:border-primary" 
                    : "bg-black/5 border-black/10 text-black hover:bg-primary hover:text-white hover:border-primary"
                )}>
                  <ChevronRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default HowItWorksSection;
