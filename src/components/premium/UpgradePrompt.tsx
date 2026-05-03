import { usePremium } from '@/contexts/PremiumContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, Shield, Crown, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpgradePromptProps {
  feature?: string;
  description?: string;
  variant?: 'dialog' | 'inline' | 'page';
}

const UpgradePrompt = ({ 
  feature, 
  description,
  variant = 'inline' 
}: UpgradePromptProps) => {
  const { plans, isPremium } = usePremium();

  const handleUpgrade = () => {
    // Redirect to mobile store or show payment link
    window.open('https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate', '_blank');
  };

  const planIcons: Record<string, any> = {
    free: Shield,
    monthly: Zap,
    yearly: Rocket,
    lifetime: Crown,
  };

  const planColors: Record<string, string> = {
    free: 'text-muted-foreground',
    monthly: 'text-blue-500',
    yearly: 'text-primary',
    lifetime: 'text-amber-500',
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${variant === 'page' ? 'py-12' : 'py-6'}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of TaskMate with our premium features. 
          Sync across all devices and get advanced analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {plans.map((plan, index) => {
          const Icon = planIcons[plan.id] || Sparkles;
          const isFeatured = plan.id === 'yearly';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full flex flex-col overflow-hidden border-2 ${isFeatured ? 'border-primary shadow-xl shadow-primary/10 scale-105 z-10' : 'border-border'}`}>
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Best Value
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-2xl bg-muted/50 mb-4 ${planColors[plan.id]}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <p className="text-sm text-primary font-semibold mt-1">{plan.tag}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col pt-4">
                  <ul className="space-y-3 mb-8 flex-1">
                    {[
                      'Real-time Cloud Sync',
                      'Task Reminders',
                      plan.id !== 'free' ? 'Advanced Analytics' : 'Basic Analytics',
                      plan.id !== 'free' ? 'Group Collaborations' : 'Single User Only',
                      plan.id !== 'free' ? 'Custom Themes' : 'Default Theme',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 ${i < 2 || plan.id !== 'free' ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        <span className={i < 2 || plan.id !== 'free' ? 'text-foreground' : 'text-muted-foreground/50'}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={handleUpgrade}
                    variant={isFeatured ? 'default' : 'outline'}
                    className={`w-full h-11 rounded-xl font-bold transition-all active:scale-[0.98] ${isPremium && plan.id !== 'free' ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {plan.id === 'free' ? 'Current Plan' : isPremium ? 'Subscribed' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {feature && (
        <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
          <p className="font-semibold text-primary">Note: {feature} is a Premium feature.</p>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default UpgradePrompt;

