import { BarChart2, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const DifferentSection = () => {
  const { theme } = useTheme();
  const features = [
    {
      icon: BarChart2,
      title: 'SMART ANALYTICS',
      description: 'Visualize your productivity velocity. Track personal node completion rates and circle performance with high-definition metrics.',
      tag: 'METRICS'
    },
    {
      icon: ShieldCheck,
      title: 'DEEP PRIVACY',
      description: 'Your data is secured by zero-knowledge encryption protocols. Personal notes and group tasks remain strictly private to your account.',
      tag: 'SECURITY'
    },
    {
      icon: HeartPulse,
      title: 'FOCUS STATES',
      description: 'Optimize your work-life balance. Our system identifies your peak productivity windows and suggests optimal focus modes.',
      tag: 'PERFORMANCE'
    }
  ];

  return (
    <section id="different" className={cn(
      "py-24 md:py-48 px-4 relative overflow-hidden transition-colors duration-700",
      theme === 'dark' ? "bg-transparent" : "bg-gray-50/50"
    )}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-32 md:mb-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12"
          >
            Evolutionary Standards
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black mb-10 tracking-tighter leading-tight pb-10 transition-colors",
              theme === 'dark' ? "text-white" : "text-black"
            )}
          >
            WHY WE<br />
            <span className="text-gradient italic">EVOLVE</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-lg md:text-2xl max-w-xl font-bold uppercase tracking-[0.4em] transition-colors",
              theme === 'dark' ? "text-white/40" : "text-black/60"
            )}
          >
            Built for creators who demand a unified workspace.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-[2000px]">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group"
            >
              <div className={cn(
                "h-full p-12 border transition-all duration-700 rounded-[2.5rem] relative overflow-hidden",
                theme === 'dark' 
                  ? "bg-black/40 border-white/5 hover:border-primary/30" 
                  : "bg-white border-black/5 hover:border-primary/20 shadow-xl shadow-black/5"
              )}>
                {/* Active Icon Zone */}
                <div className={cn(
                  "mb-16 h-80 rounded-[2rem] border overflow-hidden flex items-center justify-center relative transition-all duration-700",
                  theme === 'dark' ? "bg-black/60 border-primary/10" : "bg-gray-50 border-black/5"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <feature.icon className={cn(
                    "h-32 w-32 transition-all duration-1000 group-hover:text-primary group-hover:scale-110",
                    theme === 'dark' ? "text-white/10" : "text-black/5"
                  )} />
                  
                  {/* Floating Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <feature.icon className={cn(
                      "h-16 w-16 transition-all duration-700",
                      theme === 'dark' ? "text-primary/40 group-hover:text-primary" : "text-primary/60 group-hover:text-primary"
                    )} />
                  </div>

                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 animate-pulse" />
                </div>
                
                <div className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="h-[2px] w-12 bg-primary shadow-[0_0_10px_#22d3ee]" />
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">{feature.tag}</span>
                  </div>
                  <h3 className={cn(
                    "text-5xl font-black tracking-tighter leading-[0.9] transition-colors",
                    theme === 'dark' ? "text-white" : "text-black"
                  )}>
                    {feature.title}
                  </h3>
                  <p className={cn(
                    "text-base font-bold leading-relaxed transition-colors",
                    theme === 'dark' ? "text-white/40" : "text-black/50"
                  )}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default DifferentSection;
