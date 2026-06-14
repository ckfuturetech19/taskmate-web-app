import { useNavigate } from 'react-router-dom';
import { Check, X, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free Forever',
      badge: 'Free Access',
      description: 'Perfect for individuals getting started with AI productivity on web.',
      features: [
        { text: 'Basic AI Suggestions', available: true },
        { text: 'Up to 50 tasks/day', available: true },
        { text: 'Advanced Voice Support', available: false },
        { text: 'Team Workspaces', available: false },
      ],
      cta: 'Start Free on Web',
      isPaid: false,
      recommended: false,
    },
    {
      name: 'Monthly Pro',
      badge: 'Monthly Subscription',
      description: 'Unlock full AI capabilities and notifications inside our mobile app.',
      features: [
        { text: 'Unlimited AI Tasks', available: true },
        { text: 'Full Voice Capture', available: true },
        { text: 'Focus Mode Pro', available: true },
        { text: 'Priority Node Support', available: true },
      ],
      cta: 'Download Android App',
      isPaid: true,
      recommended: false,
    },
    {
      name: 'Yearly Pro',
      badge: 'Annual Subscription',
      description: 'Our most popular subscription plan with maximum annual billing savings.',
      features: [
        { text: 'Everything in Monthly Pro', available: true },
        { text: 'Premium Themes & Widgets', available: true },
        { text: 'Save over 30% annually', available: true },
        { text: 'Priority Node Support', available: true },
      ],
      cta: 'Download Android App',
      isPaid: true,
      recommended: true,
    },
    {
      name: 'One-Time Pro',
      badge: 'Lifetime Purchase',
      description: 'Get lifetime access to all premium Pro features with a single payment.',
      features: [
        { text: 'Everything in Pro Forever', available: true },
        { text: 'Lifetime Future Updates', available: true },
        { text: 'No recurring bills', available: true },
        { text: 'Priority Node Support', available: true },
      ],
      cta: 'Download Android App',
      isPaid: true,
      recommended: false,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 12, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
      },
    },
  };

  const handleUpgradeClick = (isPaid: boolean) => {
    if (isPaid) {
      window.open('https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate', '_blank');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-[#05020c]">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white uppercase tracking-tight"
        >
          Simple, straightforward pricing
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto mb-16"
        >
          Check out our options below. Sign up for free on web, or install our mobile app to view regional pricing rates and subscribe.
        </motion.p>

        {/* Pricing Cards Grid (4 columns) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ perspective: 1000 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch"
        >
          {plans.map((plan, i) => {
            return (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: plan.recommended ? 1.03 : 1.01 }}
                className={`pricing-card bg-white/60 dark:bg-slate-950/40 border rounded-3xl text-left flex flex-col justify-between transition-all duration-300 relative ${
                  plan.recommended 
                    ? 'border-2 border-[#8B65C8] p-6 relative z-10' 
                    : 'border-slate-200 dark:border-white/5 p-6'
                }`}
              >
                {plan.recommended && (
                  <motion.div 
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-sm"
                  >
                    Recommended
                  </motion.div>
                )}
                
                <div>
                  <h3 className="text-base font-bold mb-3 text-slate-900 dark:text-white">{plan.name}</h3>
                  
                  {/* Plan Badge (Subscription Type) */}
                  <div className="mb-5">
                    <span className="inline-block text-[9px] font-black uppercase tracking-widest text-[#8B65C8] dark:text-[#C4B8E8] bg-[#8B65C8]/10 px-2.5 py-1 rounded-md border border-[#8B65C8]/15">
                      {plan.badge}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                  
                  <div className="border-t border-slate-100 dark:border-white/5 pt-5 space-y-3.5 mb-8">
                    {plan.features.map((feature, j) => (
                      <div key={j} className={`flex items-center gap-3 text-xs ${!feature.available ? 'opacity-30' : ''}`}>
                        {feature.available ? (
                          <Check className="w-3.5 h-3.5 text-[#8B65C8] shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                        )}
                        <span className="text-slate-600 dark:text-slate-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <motion.button 
                    onClick={() => handleUpgradeClick(plan.isPaid)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl text-[10px] uppercase font-extrabold tracking-widest transition-all cursor-pointer relative overflow-hidden group flex items-center justify-center gap-1.5 ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white shadow-sm' 
                        : 'border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
                    )}
                    {plan.isPaid && <Smartphone className="w-3.5 h-3.5" />}
                    {plan.cta}
                  </motion.button>

                  {plan.isPaid && (
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold text-center mt-2.5 leading-normal">
                      * Installs directly via Google Play. Subscription details inside.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
