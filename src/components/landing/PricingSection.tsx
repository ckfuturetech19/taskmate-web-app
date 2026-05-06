import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const PricingSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const plans = [
    {
      name: 'FREE',
      tag: 'PROTOCOL 01',
      description: 'Establish your foundation with essential task and note management tools.',
      features: ['UNLIMITED PERSONAL TASKS', 'BASIC RICH NOTES', 'CLOUD SYNC', 'COMMUNITY ACCESS'],
      color: 'text-muted-foreground',
      highlight: false,
      cta: 'INITIALIZE FREE'
    },
    {
      name: 'MONTHLY',
      tag: '7-DAY TRIAL',
      description: 'Experience full power with professional collaboration and advanced sync.',
      features: ['SHARED CIRCLES', 'COLLABORATIVE NOTES', 'PRIORITY UPLINK', 'PRO DASHBOARD'],
      color: 'text-primary',
      highlight: true,
      cta: 'START TRIAL'
    },
    {
      name: 'YEARLY',
      tag: 'BEST VALUE',
      description: 'Long-term productivity nodes for dedicated creators and teams.',
      features: ['EVERYTHING IN PRO', 'PREMIUM SUPPORT', 'BETA PROTOCOLS', 'CUSTOM THEMES'],
      color: 'text-secondary',
      highlight: false,
      cta: 'GET YEARLY'
    },
    {
      name: 'ONE-TIME',
      tag: 'LIFETIME',
      description: 'Permanent ownership of the entire TaskMate ecosystem across all platforms.',
      features: ['PERPETUAL LICENSE', 'FUTURE UPDATES', 'OMNI-UPLINK', 'NO RENEWALS'],
      color: 'text-emerald-400',
      highlight: false,
      cta: 'LIFETIME ACCESS'
    }
  ];

  return (
    <section id="pricing" className={cn(
      "py-24 md:py-48 px-4 transition-colors duration-700 bg-transparent"
    )}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-32 md:mb-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-6 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-12"
          >
            System Investment
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              "text-6xl md:text-[10rem] font-black mb-10 tracking-tighter leading-[0.8] transition-colors",
              theme === 'dark' ? "text-white" : "text-black"
            )}
          >
            UNIFIED<br />
            <span className={theme === 'dark' ? "text-white/10" : "text-black/5"}>ACCESS</span>
          </motion.h2>

          <p className={cn(
            "text-lg md:text-2xl max-w-3xl mx-auto font-bold uppercase tracking-[0.3em] transition-colors",
            theme === 'dark' ? "text-white/40" : "text-black/40"
          )}>
            Activate your Pro status on mobile and sync your power across the entire web ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-[2000px]">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1, 
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={cn(
                "relative p-10 flex flex-col justify-between transition-all duration-700 rounded-[2.5rem] overflow-hidden",
                plan.highlight 
                  ? theme === 'dark' 
                    ? "bg-black/60 shadow-2xl border border-primary/30 glow-primary/5 scale-105 z-10" 
                    : "bg-white shadow-2xl border border-primary/20 scale-105 z-10"
                  : theme === 'dark'
                    ? "bg-black/30 border border-white/5 hover:border-white/10"
                    : "bg-white border border-black/5 hover:border-black/10 shadow-sm"
              )}
            >
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", plan.highlight ? "bg-primary" : "bg-muted-foreground")} />
                    <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", plan.highlight ? "text-primary" : "text-muted-foreground")}>
                      {plan.tag}
                    </span>
                  </div>
                  <h3 className={cn(
                    "text-4xl font-black tracking-tighter leading-none transition-colors",
                    theme === 'dark' ? "text-white" : "text-black"
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    "text-sm font-bold leading-relaxed transition-colors min-h-[60px]",
                    theme === 'dark' ? "text-white/40" : "text-black/40"
                  )}>
                    {plan.description}
                  </p>
                </div>

                <div className={cn("h-[1px] w-full", theme === 'dark' ? "bg-white/5" : "bg-black/5")} />

                <ul className="space-y-5">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-4 group/item">
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        plan.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className={cn(
                        "text-[9px] font-black group-hover/item:text-primary transition-colors tracking-[0.2em] uppercase leading-tight",
                        theme === 'dark' ? "text-white/40" : "text-black/40"
                      )}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-16">
                <button 
                  onClick={() => plan.name === 'FREE' ? navigate('/auth') : window.alert('Please initialize your PRO subscription via the TaskMate Mobile App to synchronize nodes across all devices.')}
                  className={cn(
                    "w-full h-16 rounded-2xl flex items-center justify-center px-10 text-[10px] font-black uppercase tracking-[0.3em] transition-all group/btn",
                    plan.highlight 
                      ? "bg-primary text-black hover:scale-[1.02] shadow-xl shadow-primary/20" 
                      : theme === 'dark'
                        ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                        : "bg-black/5 text-black border border-black/10 hover:bg-black/10"
                  )}
                >
                  <span>{plan.cta}</span>
                  <ChevronRight className="h-4 w-4 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <p className={cn(
                  "text-[8px] font-bold uppercase tracking-widest text-center mt-6 opacity-30",
                  theme === 'dark' ? "text-white" : "text-black"
                )}>
                  SYNCED VIA MOBILE UPLINK
                </p>
              </div>

              {plan.highlight && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 rounded-full" />
              )}
            </motion.div>
          ))}
        </div>

        <div className={cn(
          "mt-32 p-12 rounded-[2.5rem] border text-center transition-all duration-700",
          theme === 'dark' ? "bg-black/20 border-white/5" : "bg-black/[0.02] border-black/5"
        )}>
          <p className={cn(
            "text-sm font-bold leading-relaxed max-w-4xl mx-auto transition-colors",
            theme === 'dark' ? "text-white/40" : "text-black/40"
          )}>
            TaskMate utilizes a unified billing protocol. Subscriptions managed on the App Store or Play Store are automatically recognized across our entire web infrastructure. Simply log in with your account to reactivate your Pro nodes.
          </p>
        </div>
      </div>
    </section>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default PricingSection;
