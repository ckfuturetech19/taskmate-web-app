import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
  trend?: 'up' | 'down';
  variant?: 'default' | 'destructive';
}

const StatCard = ({ title, value, icon: Icon, className, trend, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: {
      card: 'border-border',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      value: 'text-foreground',
    },
    destructive: {
      card: 'border-destructive/20 bg-destructive/5',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      value: 'text-destructive',
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("relative overflow-hidden", styles.card, className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-2xl sm:text-3xl font-bold", styles.value)}>{value}</p>
              {trend && (
                <div className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  trend === 'up' ? "text-green-500" : "text-red-500"
                )}>
                  {trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0",
            styles.iconBg
          )}>
            <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </Card>
  );
};

export default StatCard;
