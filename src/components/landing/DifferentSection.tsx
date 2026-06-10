import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

  return (
    <section className="border-y border-[var(--aurora-border)] bg-[var(--aurora-bg-secondary)] py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-4">
          <div>
            <StatCounter target={1200} suffix="+" />
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--aurora-text-muted)]">Active Users</div>
          </div>
          <div>
            <StatCounter target={4.8} decimals={1} suffix="★" />
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--aurora-text-muted)]">User Rating</div>
          </div>
          <div>
            <StatCounter target={6} />
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--aurora-text-muted)]">Languages</div>
          </div>
          <div>
            <StatCounter target={0} prefix="₹" />
            <div className="text-sm font-bold uppercase tracking-widest text-[var(--aurora-text-muted)]">Started Free</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentSection;
