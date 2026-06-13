import { Mic, Sparkles, BellRing, CalendarDays, Target, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const featuresList = [
    {
      icon: Mic,
      title: 'Voice to Task',
      description: 'Turn ephemeral thoughts into actionable items just by speaking. High-fidelity transcriptions with context awareness.',
      delay: '0ms',
    },
    {
      icon: Sparkles,
      title: 'AI Smart Suggestions',
      description: 'Let AI handle the prioritization. TaskMate suggests what to do next based on your deadlines and energy levels.',
      delay: '100ms',
    },
    {
      icon: BellRing,
      title: 'Smart Reminders',
      description: "Reminders that adapt. If you're busy, TaskMate intelligently reschedules minor alerts to avoid flow disruption.",
      delay: '200ms',
    },
    {
      icon: CalendarDays,
      title: 'Calendar Sync',
      description: 'Deep integration with Google, Outlook, and Apple calendars. View your tasks and events in one unified AI-curated timeline.',
      delay: '300ms',
    },
    {
      icon: Target,
      title: 'Focus Mode Pro',
      description: 'A sanctuary for deep work. Block distractions and track focus duration with a minimalist, beautiful timer UI.',
      delay: '400ms',
    },
    {
      icon: LayoutGrid,
      title: 'Home Widgets',
      description: 'Stay updated without opening the app. Beautiful, glassmorphic widgets for your home and lock screen.',
      delay: '500ms',
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
    <section id="features" className="py-24 bg-white dark:bg-[#05020c]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-4"
          >
            Core Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm"
          >
            TaskMate AI isn't just a list; it's a cognitive extension that understands your workflow.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-white/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 p-8 rounded-3xl hover:border-[#8B65C8]/40 dark:hover:border-[#8B65C8]/40 hover:shadow-md transition-all duration-300 text-left group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center text-[#8B65C8] dark:text-[#C4B8E8] text-2xl mb-6 group-hover:bg-[#8B65C8] group-hover:text-white dark:group-hover:bg-[#8B65C8] transition-colors border border-slate-200/50 dark:border-white/5"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
