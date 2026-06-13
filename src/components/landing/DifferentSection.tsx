import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatCounterProps {
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const StatCounter = ({ target, duration = 2000, decimals = 0, prefix = '', suffix = '' }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(ease * target);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={elementRef} className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#F5A87B] via-[#F0607A] to-[#8B65C8] bg-clip-text text-transparent mb-2">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </div>
  );
};

const DifferentSection = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 15, scale: 0.95 },
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
    <section className="border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#05020c] py-16 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ perspective: 1000 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl transition-all"
          >
            <StatCounter target={1200} suffix="+" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Users</div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl transition-all"
          >
            <StatCounter target={4.8} decimals={1} suffix="★" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">User Rating</div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl transition-all"
          >
            <StatCounter target={6} />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Languages</div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl transition-all"
          >
            <StatCounter target={0} prefix="₹" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Started Free</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DifferentSection;
