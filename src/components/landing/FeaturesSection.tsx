import { 
  Mic, 
  Sparkles, 
  BellRing, 
  CalendarDays, 
  Target, 
  LayoutGrid, 
  FileText, 
  Trophy, 
  Clock, 
  Languages, 
  RefreshCw, 
  Sun, 
  MessageSquare, 
  Lock, 
  Cloud, 
  Users 
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const featuresList = [
    {
      icon: FileText,
      title: 'Personal & Group Notes',
      description: 'Create notes for yourself or your team, set reminders, and never lose track of shared documents and information.',
      delay: '0ms',
    },
    {
      icon: Trophy,
      title: 'Life Milestones Tracker',
      description: 'Track key life events, achievements, anniversaries, goals, and milestones with automated notifications and reminders.',
      delay: '50ms',
    },
    {
      icon: Clock,
      title: 'Productivity Focus Clocks',
      description: 'Use custom focus timers and clocks to manage your focus intervals, stay concentrated, and measure deep work.',
      delay: '100ms',
    },
    {
      icon: Languages,
      title: '6 Languages Supported',
      description: 'Full multi-language accessibility in English, Español, Français, العربية, Português, and Русский.',
      delay: '150ms',
    },
    {
      icon: RefreshCw,
      title: 'Advanced Recurring Tasks',
      description: 'Automate your routine with a robust scheduling system built to recur daily, weekly, monthly, or on custom intervals.',
      delay: '200ms',
    },
    {
      icon: Sun,
      title: 'Morning Summary Briefings',
      description: 'Start every day with an organized briefing containing today\'s priority tasks, milestones, and pending actions.',
      delay: '250ms',
    },
    {
      icon: Mic,
      title: 'Voice-to-Task Capture',
      description: 'Quickly record thoughts by speaking. TaskMate converts your voice inputs into clear, organized items instantly.',
      delay: '300ms',
    },
    {
      icon: BellRing,
      title: 'Smart Adaptable Reminders',
      description: 'Get notified without flow disruption. Alerts intelligently reschedule based on your focus calendars.',
      delay: '350ms',
    },
    {
      icon: CalendarDays,
      title: 'Google Calendar Sync',
      description: 'Sync your tasks, notes, and milestones seamlessly with Google Calendar and local devices in one timeline.',
      delay: '400ms',
    },
    {
      icon: LayoutGrid,
      title: 'Home Screen Widgets',
      description: 'Check off accomplishments or add items directly from your mobile home screen using sleek glassmorphic widgets.',
      delay: '450ms',
    },
    {
      icon: Users,
      title: 'Group Collaboration',
      description: 'Collaborate with friends, family, or colleagues. Assign list actions and sync group notebooks in real-time.',
      delay: '500ms',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Productivity',
      description: 'Leverage AI assistance for planning, summary analysis, and personal habits organization.',
      delay: '550ms',
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
          style={{ perspective: 1000 }}
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
