import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const IntegrationsSection = () => {
  const integrations = [
    'Slack',
    'Google Calendar',
    'Gmail',
    'Notion',
    'Asana',
    'Google Drive',
    'WhatsApp',
    'GitHub'
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Calculate coordinates dynamically for SVG connections
  useEffect(() => {
    const calculateConnections = () => {
      if (!containerRef.current || !logoRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();

      const cx = logoRect.left - containerRect.left + logoRect.width / 2;
      const cy = logoRect.top - containerRect.top + logoRect.height / 2;

      const newConnections: Connection[] = [];

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const px = cardRect.left - containerRect.left + cardRect.width / 2;
        const py = cardRect.top - containerRect.top + cardRect.height / 2;

        newConnections.push({
          x1: cx,
          y1: cy,
          x2: px,
          y2: py,
        });
      });

      setConnections(newConnections);
    };

    // Delay calculation slightly to allow grid rendering and ref settling
    const timer = setTimeout(calculateConnections, 200);

    window.addEventListener('resize', calculateConnections);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateConnections);
    };
  }, [integrations.length]);

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
    <section className="py-24 px-4 bg-white dark:bg-[#05020c] relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Title */}
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

        {/* Central Logo & Grid Connections Wrapper */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto p-4 min-h-[300px]">
          
          {/* SVG Connection Lines (Behind elements) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((c, i) => {
              // Calculate a bezier control point with slight curve
              const midX = (c.x1 + c.x2) / 2;
              const midY = (c.y1 + c.y2) / 2 - 20;

              return (
                <g key={i}>
                  {/* Underlay elastic line paths */}
                  <motion.path
                    d={`M ${c.x1} ${c.y1} Q ${midX} ${midY}, ${c.x2} ${c.y2}`}
                    fill="none"
                    stroke="rgba(139, 101, 200, 0.15)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  />
                  {/* Glowing traveler along the bezier path */}
                  <motion.path
                    d={`M ${c.x1} ${c.y1} Q ${midX} ${midY}, ${c.x2} ${c.y2}`}
                    fill="none"
                    stroke="url(#glowGradient)"
                    strokeWidth="3.5"
                    initial={{ strokeDasharray: "10 50", strokeDashoffset: 60 }}
                    animate={{ strokeDashoffset: -300 }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                  />
                </g>
              );
            })}
            
            {/* Glow gradient definition */}
            <defs>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0607A" stopOpacity="0" />
                <stop offset="50%" stopColor="#8B65C8" stopOpacity="1" />
                <stop offset="100%" stopColor="#4ABFB8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Core Badge (TaskMate Core) */}
          <div className="flex items-center justify-center mb-16 relative z-10">
            <motion.div 
              ref={logoRef}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ rotate: 3, scale: 1.05 }}
              className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-[#8B65C8]/5 border-2 border-[#8B65C8]/10 flex items-center justify-center cursor-pointer select-none relative shadow-lg dark:shadow-[#8B65C8]/5"
            >
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-3xl border border-[#8B65C8]/25 animate-ping opacity-30" />
              <span className="text-xl md:text-2xl font-bold text-[#8B65C8] dark:text-[#C4B8E8]">TaskMate</span>
            </motion.div>
          </div>

          {/* Integration Logos Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto relative z-10"
          >
            {integrations.map((integration, idx) => (
              <motion.div
                key={integration}
                ref={(el) => { cardRefs.current[idx] = el; }}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02, border: '1px solid rgba(139, 101, 200, 0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="h-16 md:h-20 rounded-2xl bg-white/70 dark:bg-slate-950/50 backdrop-blur-md border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-xs transition-all duration-200 cursor-pointer select-none"
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
