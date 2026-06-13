import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Perfect for individuals getting started with AI productivity.',
      features: [
        { text: 'Basic AI Suggestions', available: true },
        { text: 'Up to 50 tasks/day', available: true },
        { text: 'Advanced Voice Support', available: false },
        { text: 'Team Collaboration', available: false },
      ],
      cta: 'Start Free',
      recommended: false,
    },
    {
      name: 'Pro',
      priceMonthly: 199,
      priceAnnual: 159,
      description: 'Advanced tools for power users who want maximum efficiency.',
      features: [
        { text: 'Unlimited AI Tasks', available: true },
        { text: 'Full Voice Capture', available: true },
        { text: 'Focus Mode Pro', available: true },
        { text: 'Custom App Themes', available: true },
      ],
      cta: 'Get Started Now',
      recommended: true,
    },
    {
      name: 'Team',
      priceMonthly: 499,
      priceAnnual: 399,
      description: 'Collaborative workspace for teams to stay aligned effortlessly.',
      features: [
        { text: 'Everything in Pro', available: true },
        { text: 'Shared Team Workspaces', available: true },
        { text: 'Advanced Analytics', available: true },
        { text: 'Priority Support', available: true },
      ],
      cta: 'Talk to Sales',
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-[#05020c]">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold mb-8 text-slate-900 dark:text-white uppercase tracking-tight"
        >
          Simple, straightforward pricing
        </motion.h2>
        
        {/* Billing Switcher Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200 dark:border-white/5 mb-16 shadow-inner"
        >
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
              !isAnnual 
                ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider relative transition-all flex items-center gap-2 cursor-pointer ${
              isAnnual 
                ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Annual <span className="text-[9px] px-1.5 py-0.5 bg-[#4ABFB8]/20 text-[#4ABFB8] rounded-md font-extrabold normal-case">Save 20%</span>
          </button>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch"
        >
          {plans.map((plan, i) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: plan.recommended ? 1.05 : 1.01 }}
                className={`pricing-card bg-white/60 dark:bg-slate-950/40 border rounded-3xl text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  plan.recommended 
                    ? 'border-2 border-[#8B65C8] p-8 md:p-10 relative z-10 scale-[1.03]' 
                    : 'border-slate-200 dark:border-white/5 p-8'
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
                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                  
                  {/* Pricing number animate transition */}
                  <motion.div 
                    key={price}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl font-black mb-6 text-slate-900 dark:text-white flex items-baseline"
                  >
                    ₹{price}
                    <span className="text-sm text-slate-400 dark:text-slate-500 font-bold ml-1">/mo</span>
                  </motion.div>
                  
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                  
                  <div className="border-t border-slate-100 dark:border-white/5 pt-6 space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <div key={j} className={`flex items-center gap-3 text-xs sm:text-sm ${!feature.available ? 'opacity-30' : ''}`}>
                        {feature.available ? (
                          <Check className="w-4 h-4 text-[#8B65C8] shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                        )}
                        <span className="text-slate-600 dark:text-slate-300">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button 
                  onClick={() => navigate('/auth')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl text-xs uppercase font-extrabold tracking-widest transition-all cursor-pointer ${
                    plan.recommended 
                      ? 'bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white font-extrabold shadow-sm' 
                      : 'border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
