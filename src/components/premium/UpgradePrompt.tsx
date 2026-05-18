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
    <div className={`w-full max-w-6xl mx-auto px-4 ${variant === 'page' ? 'py-12' : 'py-2'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border-primary/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg group hover:border-primary/40 transition-all"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-0.5">
              Tactical Limitation Active
            </p>
            <p className="text-[11px] font-bold text-muted-foreground leading-tight">
              {description || "Upgrade to Pro to unlock write access and full synchronization."}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleUpgrade}
          size="sm"
          className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-black text-[10px] tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Upgrade Node
        </Button>
      </motion.div>
    </div>
  );
};

export default UpgradePrompt;

