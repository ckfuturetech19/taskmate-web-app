import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonialsList = [
    {
      name: 'Rahul Sharma',
      role: 'Product Designer, Bangalore',
      content: 'TaskMate AI has completely changed how I manage my freelance projects. The voice input is scary accurate — it feels like having a real assistant.',
      initials: 'RS',
      gradient: 'from-[#F5A87B] to-[#F0607A]',
    },
    {
      name: 'Ananya Misra',
      role: 'Project Manager, Mumbai',
      content: "As a PM, my day is scattered. TaskMate's AI suggestions surface exactly what I need to focus on next. No more scrolling through endless lists.",
      initials: 'AM',
      gradient: 'from-[#8B65C8] to-[#4ABFB8]',
    },
    {
      name: 'Vikram Kapoor',
      role: 'Android Developer, Gurgaon',
      content: 'Finally, a task manager that understands Android design language. The widgets are beautiful and actually functional.',
      initials: 'VK',
      gradient: 'from-[#F0607A] to-[#8B65C8]',
    },
  ];

  // Duplicate the list to ensure seamless infinite looping scroll
  const doubleList = [...testimonialsList, ...testimonialsList, ...testimonialsList, ...testimonialsList];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#05020c] overflow-hidden">
      <div className="container mx-auto px-6 mb-16 text-center max-w-7xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight"
        >
          Loved by productivity experts
        </motion.h2>
      </div>

      <div className="relative w-full overflow-hidden py-4">
        {/* We add a marquee hover pause style in this inline block */}
        <style>{`
          .marquee-track-animated {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: scroll 30s linear infinite;
          }
          .marquee-track-animated:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="marquee-track-animated">
          {doubleList.map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -6, scale: 1.01 }}
              className="w-[340px] shrink-0 p-8 rounded-3xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 hover:border-[#8B65C8]/30 transition-all text-left shadow-xs cursor-pointer"
            >
              <div className="flex gap-1 text-[#F5A87B] mb-6">
                {[...Array(5)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm italic mb-8 leading-relaxed">
                "{item.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center font-bold text-white text-sm shadow-xs`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
