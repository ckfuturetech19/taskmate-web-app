import { motion } from 'framer-motion';

const IntegrationsSection = () => {
  const integrations = [
    'Slack',
    'Google Analytics',
    'Gmail',
    'Google Drive',
    'Asana',
    'Dropbox',
    'TikTok',
    'Facebook'
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-24 px-4 bg-white dark:bg-[#05020c]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight mb-4"
          >
            Integrations with your favorite tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto"
          >
            Streamline your workflow and enhance productivity with smart tools and seamless automation. Get more done in less time, effortlessly.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Logo */}
          <div className="flex items-center justify-center mb-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ rotate: 3, scale: 1.05 }}
              className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-[#8B65C8]/5 border-2 border-[#8B65C8]/10 flex items-center justify-center cursor-pointer select-none"
            >
              <span className="text-xl md:text-2xl font-bold text-[#8B65C8] dark:text-[#C4B8E8]">TaskMate</span>
            </motion.div>
          </div>

          {/* Integration Logos Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto"
          >
            {integrations.map((integration) => (
              <motion.div
                key={integration}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02, border: '1px solid rgba(139, 101, 200, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="h-16 md:h-20 rounded-2xl bg-white/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer select-none"
              >
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center px-2">
                  {integration}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
