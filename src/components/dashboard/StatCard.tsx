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
      card: 'text-primary-foreground border-primary',
      iconBg: 'bg-primary-foreground/20',
      iconColor: 'text-primary-foreground',
      value: 'text-primary-foreground',
      title: 'text-primary-foreground/90',
    },
    default: {
      card: 'bg-card border-border',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: 'text-foreground',
      title: 'text-muted-foreground',
    },
    destructive: {
      card: 'bg-card border-border',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      value: 'text-destructive',
      title: 'text-muted-foreground',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden group cursor-pointer transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        "animate-slide-in-up rounded-xl border-2",
        styles.card,
        variant === 'primary' ? '' : 'bg-card',
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        ...(variant === 'primary' ? { background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' } : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs sm:text-sm font-medium mb-2",
              styles.title
            )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2 flex-wrap mb-2">
              <p className={cn(
                "text-3xl sm:text-4xl font-bold transition-all duration-300",
                isHovered && "scale-105",
                styles.value
              )}>
                {value}
              </p>
            </div>
            {trend && (
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                  variant === 'primary'
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : trend === 'up'
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                )}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trendValue && <span>{trendValue}</span>}
                </div>
                {trendText && (
                  <p className={cn(
                    "text-xs",
                    variant === 'primary' ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {trendText}
                  </p>
                )}
              </div>
            )}
            {subtitle && !trend && (
              <p className={cn(
                "text-xs mt-2",
                variant === 'primary' ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shrink-0",
            "transition-all duration-300 group-hover:scale-110",
            styles.iconBg
          )}>
            <Icon className={cn(
              "h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300",
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
