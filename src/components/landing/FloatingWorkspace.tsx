import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Sparkles, Mic, Clock, CheckSquare, Slack, Github, 
  Mail, Calendar, Bell, Settings, MessageSquare, Briefcase, BarChart3, Compass
} from 'lucide-react';

interface FloatingCardProps {
  icon: React.ComponentType<any>;
  colorClass: string;
  bgGlow: string;
  x: number;
  y: number;
  depth: number;
  smoothMouseX: any;
  smoothMouseY: any;
  containerRef: React.RefObject<HTMLDivElement>;
  onDragStart: () => void;
  onDragEnd: (event: any, info: any) => void;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
  icon: Icon,
  colorClass,
  bgGlow,
  x,
  y,
  depth,
  smoothMouseX,
  smoothMouseY,
  containerRef,
  onDragStart,
  onDragEnd,
}) => {
  // subtle mouse parallax: shifts slightly based on cursor to add 3D depth
  const parallaxX = useTransform(smoothMouseX, (val: number) => val * depth * 35);
  const parallaxY = useTransform(smoothMouseY, (val: number) => val * depth * 35);

  return (
    <motion.div
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        x: parallaxX, 
        y: parallaxY 
      }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        drag
        dragConstraints={containerRef}
        dragElastic={0.3}
        dragSnapToOrigin={true}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        whileHover={{ 
          scale: 1.1,
          zIndex: 30,
          boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -5px rgba(0, 0, 0, 0.03)'
        }}
        whileDrag={{ scale: 1.15, zIndex: 40, cursor: 'grabbing' }}
        transition={{ type: 'spring', stiffness: 450, damping: 18 }}
        className={`w-14 h-14 md:w-18 md:h-18 flex items-center justify-center bg-white/95 dark:bg-slate-900/90 border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-md ${bgGlow} cursor-grab active:cursor-grabbing select-none transition-colors duration-300`}
      >
        <Icon className={`w-6.5 h-6.5 md:w-8 md:h-8 ${colorClass} stroke-[2]`} />
      </motion.div>
    </motion.div>
  );
};

interface CardState {
  id: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  bgGlow: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
}

export const FloatingWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for normalized mouse positions (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very gentle spring settings for organic mouse responsive shift
  const springConfig = { damping: 30, stiffness: 80, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const draggedCardId = useRef<string | null>(null);

  // Set initial coordinates distributed around the perimeter
  const initialCards: CardState[] = [
    {
      id: 'calendar',
      icon: Calendar,
      colorClass: 'text-blue-500',
      bgGlow: 'shadow-blue-500/5 hover:border-blue-500/40',
      x: 15,
      y: 15,
      vx: (Math.random() - 0.5) * 0.03 - 0.015,
      vy: (Math.random() - 0.5) * 0.03 - 0.015,
      depth: 0.35,
    },
    {
      id: 'mail',
      icon: Mail,
      colorClass: 'text-amber-500',
      bgGlow: 'shadow-amber-500/5 hover:border-amber-500/40',
      x: 30,
      y: 12,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03 - 0.015,
      depth: 0.2,
    },
    {
      id: 'slack',
      icon: Slack,
      colorClass: 'text-[#4A154B] dark:text-[#C4B8E8]',
      bgGlow: 'shadow-purple-500/5 hover:border-[#4A154B]/40',
      x: 70,
      y: 12,
      vx: (Math.random() - 0.5) * 0.03 + 0.015,
      vy: (Math.random() - 0.5) * 0.03 - 0.015,
      depth: 0.25,
    },
    {
      id: 'github',
      icon: Github,
      colorClass: 'text-slate-800 dark:text-white',
      bgGlow: 'shadow-slate-500/5 hover:border-slate-500/40',
      x: 85,
      y: 15,
      vx: (Math.random() - 0.5) * 0.03 + 0.015,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.4,
    },
    {
      id: 'voice',
      icon: Mic,
      colorClass: 'text-rose-500',
      bgGlow: 'shadow-rose-500/5 hover:border-rose-500/40',
      x: 12,
      y: 40,
      vx: (Math.random() - 0.5) * 0.03 - 0.015,
      vy: (Math.random() - 0.5) * 0.03,
      depth: 0.3,
    },
    {
      id: 'chat',
      icon: MessageSquare,
      colorClass: 'text-emerald-500',
      bgGlow: 'shadow-emerald-500/5 hover:border-emerald-500/40',
      x: 88,
      y: 38,
      vx: (Math.random() - 0.5) * 0.03 + 0.015,
      vy: (Math.random() - 0.5) * 0.03,
      depth: 0.45,
    },
    {
      id: 'tasks',
      icon: CheckSquare,
      colorClass: 'text-lime-500',
      bgGlow: 'shadow-lime-500/5 hover:border-lime-500/40',
      x: 12,
      y: 65,
      vx: (Math.random() - 0.5) * 0.03 - 0.015,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.25,
    },
    {
      id: 'clock',
      icon: Clock,
      colorClass: 'text-teal-500',
      bgGlow: 'shadow-teal-500/5 hover:border-teal-500/40',
      x: 88,
      y: 62,
      vx: (Math.random() - 0.5) * 0.03 + 0.015,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.35,
    },
    {
      id: 'analytics',
      icon: BarChart3,
      colorClass: 'text-cyan-500',
      bgGlow: 'shadow-cyan-500/5 hover:border-cyan-500/40',
      x: 18,
      y: 82,
      vx: (Math.random() - 0.5) * 0.03 - 0.015,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.3,
    },
    {
      id: 'settings',
      icon: Settings,
      colorClass: 'text-orange-500',
      bgGlow: 'shadow-orange-500/5 hover:border-orange-500/40',
      x: 34,
      y: 86,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.15,
    },
    {
      id: 'sparkles',
      icon: Sparkles,
      colorClass: 'text-fuchsia-500',
      bgGlow: 'shadow-fuchsia-500/5 hover:border-fuchsia-500/40',
      x: 66,
      y: 86,
      vx: (Math.random() - 0.5) * 0.03,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.2,
    },
    {
      id: 'briefcase',
      icon: Briefcase,
      colorClass: 'text-indigo-500',
      bgGlow: 'shadow-indigo-500/5 hover:border-indigo-500/40',
      x: 82,
      y: 82,
      vx: (Math.random() - 0.5) * 0.03 + 0.015,
      vy: (Math.random() - 0.5) * 0.03 + 0.015,
      depth: 0.38,
    }
  ];

  const [cards, setCards] = useState<CardState[]>(initialCards);

  // Mouse move handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  // Real-time physics engine loop
  useEffect(() => {
    let active = true;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (!active) return;
      
      // Calculate time delta (normalize around 60fps)
      const delta = Math.min((now - lastTime) / 16.666, 4);
      lastTime = now;

      setCards(prevCards => {
        return prevCards.map((card, i) => {
          // If being dragged, bypass physics coordinate updates
          if (draggedCardId.current === card.id) {
            return card;
          }

          // Apply 0.992 damping multiplier for more active, kinetic deceleration
          let vx = card.vx * 0.992;
          let vy = card.vy * 0.992;

          // 1. Repulsion from the Center Text (cx: 50, cy: 50)
          const cx = 50;
          const cy = 50;
          const rCenter = 28; // balanced radius for in-between card sizes
          
          const dxCenter = card.x - cx;
          const dyCenter = card.y - cy;
          const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
          
          if (distCenter < rCenter) {
            const overlap = rCenter - distCenter;
            // Gentle push force pointing outwards from center
            const force = overlap * 0.0035;
            vx += (dxCenter / (distCenter || 1)) * force;
            vy += (dyCenter / (distCenter || 1)) * force;
          }

          // 2. Repulsion from Other Cards (prevent overlapping/grouping)
          const rItems = 14; // balanced keeping-apart radius for in-between card sizes
          prevCards.forEach((otherCard, j) => {
            if (i === j) return;
            const dxOther = card.x - otherCard.x;
            const dyOther = card.y - otherCard.y;
            const distOther = Math.sqrt(dxOther * dxOther + dyOther * dyOther);

            if (distOther < rItems && distOther > 0.1) {
              const overlap = rItems - distOther;
              const force = overlap * 0.0018;
              vx += (dxOther / distOther) * force;
              vy += (dyOther / distOther) * force;
            }
          });

          // 3. Subtle Brownian Drift (random organic drift nudges)
          vx += (Math.random() - 0.5) * 0.0008;
          vy += (Math.random() - 0.5) * 0.0008;

          // 4. Speed Limits (moderated to be slightly faster than previous step)
          const maxSpeed = 0.05;
          const minSpeed = 0.01;
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed;
            vy = (vy / speed) * maxSpeed;
          } else if (speed < minSpeed && speed > 0.0001) {
            vx = (vx / speed) * minSpeed;
            vy = (vy / speed) * minSpeed;
          }

          // Update position
          let nextX = card.x + vx * delta;
          let nextY = card.y + vy * delta;

          // 5. Outer Screen Boundary Bouncing
          const minX = 4;
          const maxX = 94;
          const minY = 5;
          const maxY = 92;

          if (nextX <= minX) {
            nextX = minX;
            vx = Math.abs(vx) * 0.95;
          } else if (nextX >= maxX) {
            nextX = maxX;
            vx = -Math.abs(vx) * 0.95;
          }

          if (nextY <= minY) {
            nextY = minY;
            vy = Math.abs(vy) * 0.95;
          } else if (nextY >= maxY) {
            nextY = maxY;
            vy = -Math.abs(vy) * 0.95;
          }

          return {
            ...card,
            x: nextX,
            y: nextY,
            vx,
            vy,
          };
        });
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      active = false;
    };
  }, []);

  const handleDragStart = (id: string) => {
    draggedCardId.current = id;
  };

  const handleDragEnd = (id: string, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Convert px screen displacement values into parent-relative percentages
    const deltaXPercent = (info.offset.x / rect.width) * 100;
    const deltaYPercent = (info.offset.y / rect.height) * 100;

    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.id === id) {
          let nextX = card.x + deltaXPercent;
          let nextY = card.y + deltaYPercent;

          // Clamp to safety margins
          nextX = Math.max(4, Math.min(94, nextX));
          nextY = Math.max(5, Math.min(92, nextY));

          // Set organic velocity upon toss release
          const vx = (Math.random() - 0.5) * 0.03;
          const vy = (Math.random() - 0.5) * 0.03;

          return {
            ...card,
            x: nextX,
            y: nextY,
            vx,
            vy,
          };
        }
        return card;
      });
    });

    draggedCardId.current = null;
  };

  return (
    <section 
      ref={containerRef} 
      className="py-28 bg-white dark:bg-[#05020c] relative overflow-hidden min-h-[600px] flex items-center justify-center"
    >
      {/* Decorative Interactive Background Radial Glow (follows cursor coordinates indirectly) */}
      <motion.div 
        style={{
          x: useTransform(smoothMouseX, (val) => val * 150),
          y: useTransform(smoothMouseY, (val) => val * 150),
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#8B65C8]/5 dark:from-[#8B65C8]/7 to-transparent blur-[100px] pointer-events-none rounded-full" 
      />

      <div className="container mx-auto px-6 max-w-7xl relative w-full h-full min-h-[550px] flex items-center justify-center">
        
        {/* Floating Items Array */}
        {cards.map((card) => (
          <FloatingCard
            key={card.id}
            icon={card.icon}
            colorClass={card.colorClass}
            bgGlow={card.bgGlow}
            x={card.x}
            y={card.y}
            depth={card.depth}
            smoothMouseX={smoothMouseX}
            smoothMouseY={smoothMouseY}
            containerRef={containerRef}
            onDragStart={() => handleDragStart(card.id)}
            onDragEnd={(e, info) => handleDragEnd(card.id, info)}
          />
        ))}

        {/* Centerpiece Text - Styled directly on the clean page background */}
        <div className="max-w-2xl text-center z-20 relative px-4 select-none pointer-events-none">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B65C8]/10 border border-[#8B65C8]/25 mb-6 pointer-events-auto cursor-default"
          >
            <Compass className="w-3.5 h-3.5 text-[#8B65C8] dark:text-[#C4B8E8]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B65C8] dark:text-[#C4B8E8]">
              Workspace Orbit
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight leading-[1.15]">
            Transform Your Workflow<br/>
            <span className="bg-gradient-to-r from-[#F0607A] via-[#8B65C8] to-[#4ABFB8] bg-clip-text text-transparent">
              With Perfect Harmony
            </span>
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto pointer-events-auto">
            Empowering your productivity with seamless tool integration, automated task sorting, and focus tracking. Grab, drag, and interact with widgets as they orbit dynamically in your productivity ecosystem.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <a 
              href="https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#8B65C8] hover:bg-[#8B65C8]/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>🤖</span> Download Free on Play Store
            </a>
            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 select-none opacity-60">
              <span>🍎</span> iOS App Coming Soon
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FloatingWorkspace;
