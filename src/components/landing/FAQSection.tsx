import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is TaskMate AI really free?',
      answer: 'Yes! Our basic plan is free forever and includes unlimited tasks, voice input, and reminders. We only charge for premium AI features and team collaboration.',
    },
    {
      question: 'Which platforms is it available on?',
      answer: 'Currently, we are natively available on Android. iOS and Web versions are in active development and will be launching soon.',
    },
    {
      question: 'How does the AI suggestion engine work?',
      answer: 'TaskMate uses local neural models to analyze your historical task completion patterns, deadlines, and current focus hours to surface the most relevant tasks.',
    },
    {
      question: 'Can I use TaskMate offline?',
      answer: 'Absolutely. All your tasks are stored locally first. Changes will sync to the cloud automatically once you\'re back online.',
    },
    {
      question: 'Is team collaboration available now?',
      answer: 'Yes, Team workspaces are available under the Team plan. You can share projects, assign tasks, and track group progress in real-time.',
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-[#05020c]">
      <div className="max-w-[720px] mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-center mb-16 text-slate-900 dark:text-white uppercase tracking-tight"
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-white/5 pb-4"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left py-4 focus:outline-hidden group cursor-pointer"
                >
                  <span className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                    isOpen ? 'text-[#8B65C8]' : 'text-slate-900 dark:text-white group-hover:text-[#8B65C8]'
                  }`}>
                    {faq.question}
                  </span>
                  
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? "#8B65C8" : "#94a3b8" }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed pb-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
