import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from '@/lib/faqData';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-[#05020c]" itemScope itemType="https://schema.org/FAQPage">
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
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className={`border rounded-2xl px-5 sm:px-6 transition-all duration-300 ${
                  isOpen 
                    ? 'border-[#8B65C8]/40 bg-[#8B65C8]/5 dark:bg-[#8B65C8]/5 shadow-[0_0_20px_-3px_rgba(139,101,200,0.15)] dark:shadow-[0_0_20px_-3px_rgba(139,101,200,0.25)]' 
                    : 'border-slate-200 dark:border-white/5 bg-transparent'
                }`}
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between text-left py-4 focus:outline-hidden group cursor-pointer"
                >
                  <span 
                    itemProp="name"
                    className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                      isOpen ? 'text-[#8B65C8]' : 'text-slate-900 dark:text-white group-hover:text-[#8B65C8]'
                    }`}
                  >
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
                      <p 
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                        className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed pb-4"
                      >
                        <span itemProp="text">{faq.answer}</span>
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
