import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  className?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  variant?: 'primary' | 'destructive' | 'accent' | 'purple' | 'default';
  delay?: number;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  className, 
  trend, 
  trendValue, 
  variant = 'default', 
  delay = 0 
}: StatCardProps) => {

  const variantStyles = {
    primary: {
      iconBg: 'bg-gradient-to-br from-[#FF3CAC] to-[#7B2FBE] text-white',
      beamClass: 'hover-beam-primary',
    },
    destructive: {
      iconBg: 'bg-[#FFB300]/10 text-[#FFB300]',
      beamClass: 'hover-beam-destructive',
    },
    accent: {
      iconBg: 'bg-[#00C9A7]/10 text-[#00C9A7]',
      beamClass: 'hover-beam-accent',
    },
    purple: {
      iconBg: 'bg-[#FF6B6B]/10 text-[#FF6B6B]',
      beamClass: 'hover-beam-purple',
    },
    default: {
      iconBg: 'bg-[var(--border-strong)] text-[var(--text-secondary)]',
      beamClass: 'hover-beam-default',
    }
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: delay / 1000, 
        ease: 'easeOut' 
      }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card 
        className={cn(
          "stat-card-beam rounded-[12px] overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[0_12px_24px_rgba(123,47,190,0.05)] h-full relative group transition-all duration-300",
          styles.beamClass,
          className
        )}
      >
        <CardContent className="p-[20px] px-[24px] h-full flex flex-col justify-between relative z-10">
          {/* Top Row: Icon + Trend */}
          <div className="flex items-center justify-between w-full mb-4">
            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm", styles.iconBg)}>
              <Icon className="h-5 w-5" />
            </div>
            
            {trend && (
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
                trend === 'up'
                  ? "bg-[#00C9A7]/10 text-[#00C9A7]"
                  : "bg-[#FF4757]/10 text-[#FF4757]"
              )}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trendValue && <span>{trendValue}%</span>}
              </div>
            )}
          </div>

          {/* Bottom Area: Big Number + Title */}
          <div className="mt-auto">
            <motion.h2 
              key={String(value)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.h2>
            <p className="text-[12px] font-medium text-[var(--text-muted)]">
              {title}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
