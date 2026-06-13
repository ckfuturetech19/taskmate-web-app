import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#05020c]">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.01 }}
          className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden border border-slate-200 dark:border-white/5 shadow-xs"
        >
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tight"
            >
              Ready to plan smarter?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-10"
            >
              Join 1,200+ users who have transformed their life with TaskMate AI. Download for free today.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.button 
                onClick={() => navigate('/auth')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F0607A] to-[#8B65C8] text-white text-xs uppercase font-extrabold tracking-widest rounded-full shadow-lg shadow-[#F0607A]/20 transition-all cursor-pointer relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer-slide" />
                Download for Android
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-white text-xs uppercase font-extrabold tracking-widest rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
              >
                See on Product Hunt
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
