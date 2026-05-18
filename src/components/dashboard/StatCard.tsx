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
  trendText?: string;
  variant?: 'default' | 'destructive' | 'primary' | 'accent' | 'purple';
  delay?: number;
  subtitle?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  className, 
  trend, 
  trendValue, 
  trendText, 
  variant = 'default', 
  delay = 0, 
  subtitle 
}: StatCardProps) => {
  
  const variantStyles = {
    primary: {
      card: 'border-primary/20 bg-primary/10 hover:bg-primary/20',
      iconBg: 'bg-primary/20',
      iconColor: 'text-primary',
      glow: 'shadow-primary/20',
    },
    purple: {
      card: 'border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      glow: 'shadow-purple-500/20',
    },
    accent: {
      card: 'border-cyan-500/20 bg-cyan-500/10 hover:bg-cyan-500/20',
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      glow: 'shadow-cyan-500/20',
    },
    default: {
      card: 'glass border-white/10 hover:border-primary/30',
      iconBg: 'bg-white/5',
      iconColor: 'text-foreground',
      glow: 'shadow-black/20',
    },
    destructive: {
      card: 'border-destructive/20 bg-destructive/10 hover:bg-destructive/20',
      iconBg: 'bg-destructive/20',
      iconColor: 'text-destructive',
      glow: 'shadow-destructive/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="perspective"
    >
      <Card 
        className={cn(
          "relative overflow-hidden group cursor-pointer transition-all duration-500",
          "rounded-xl border cursor-tracking-card preserve-3d h-full",
          styles.card,
          styles.glow,
          className
        )}
      >
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full", styles.iconBg)} />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                {title}
              </p>
              
              <div className="flex items-baseline gap-2 flex-wrap mb-1">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground group-hover:scale-105 transition-transform duration-500 origin-left">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </h2>
              </div>

              {trend && (
                <div className="flex items-center gap-2 mt-4">
                  <div className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                    trend === 'up'
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  )}>
                    {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trendValue && <span>{trendValue}%</span>}
                  </div>
                  {trendText && (
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {trendText}
                    </p>
                  )}
                </div>
              )}

              {subtitle && !trend && (
                <p className="text-xs mt-4 font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                  {subtitle}
                </p>
              )}
            </div>

            <div className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
              "transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
              styles.iconBg
            )}>
              <Icon className={cn(
                "h-7 w-7 transition-all duration-500",
                styles.iconColor
              )} />
            </div>
          </div>
        </CardContent>

        {/* Bottom border glow */}
        <div className={cn(
          "absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700",
          variant === 'purple' && "via-purple-500",
          variant === 'accent' && "via-cyan-500",
          variant === 'destructive' && "via-destructive"
        )} />
      </Card>
    </motion.div>
  );
};

export default StatCard;

