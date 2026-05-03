import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  trendText?: string;
  variant?: 'default' | 'destructive' | 'primary';
  delay?: number;
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, className, trend, trendValue, trendText, variant = 'default', delay = 0, subtitle }: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const variantStyles = {
    primary: {
      card: 'text-primary-foreground border-primary/20 bg-primary shadow-primary/20',
      iconBg: 'bg-white/20',
      iconColor: 'text-primary-foreground',
      value: 'text-primary-foreground',
      title: 'text-primary-foreground/90',
      gradient: 'linear-gradient(135deg, #1E6F43, #2FAE72)',
    },
    default: {
      card: 'bg-card/50 backdrop-blur-md border-border/50 hover:border-primary/50 shadow-sm',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: 'text-foreground',
      title: 'text-muted-foreground',
      gradient: 'none',
    },
    destructive: {
      card: 'bg-card/50 backdrop-blur-md border-border/50 hover:border-destructive/50 shadow-sm',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      value: 'text-destructive',
      title: 'text-muted-foreground',
      gradient: 'none',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden group cursor-pointer transition-all duration-500",
        "hover:shadow-2xl hover:-translate-y-1.5",
        "animate-slide-in-up rounded-2xl border",
        styles.card,
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        background: styles.gradient !== 'none' ? styles.gradient : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background glow */}
      {isHovered && variant !== 'primary' && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl rounded-full transition-all duration-1000 animate-pulse" />
      )}

      <CardContent className="p-5 sm:p-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2",
              styles.title
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap mb-1">
              <p className={cn(
                "text-3xl sm:text-4xl font-black transition-all duration-500",
                isHovered && "scale-105 origin-left",
                styles.value
              )}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
            {trend && (
              <div className="flex items-center gap-2 mt-3">
                <div className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                  variant === 'primary'
                    ? "bg-white/20 text-primary-foreground"
                    : trend === 'up'
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                )}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trendValue && <span>{trendValue}%</span>}
                </div>
                {trendText && (
                  <p className={cn(
                    "text-[10px] font-medium uppercase tracking-tight",
                    variant === 'primary' ? "text-primary-foreground/70" : "text-muted-foreground/70"
                  )}>
                    {trendText}
                  </p>
                )}
              </div>
            )}
            {subtitle && !trend && (
              <p className={cn(
                "text-xs mt-3 font-medium opacity-80",
                variant === 'primary' ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
            "transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
            styles.iconBg
          )}>
            <Icon className={cn(
              "h-6 w-6 sm:h-7 sm:w-7 transition-all duration-500",
              isHovered && "scale-110",
              styles.iconColor
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
