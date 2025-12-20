import { usePremium } from '@/contexts/PremiumContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  onUpgrade?: () => void;
  variant?: 'dialog' | 'inline' | 'banner';
}

const UpgradePrompt = ({ 
  feature, 
  description, 
  onUpgrade,
  variant = 'inline' 
}: UpgradePromptProps) => {
  const { pricing } = usePremium();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default: Open mobile app or show download link
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try to open app, fallback to Play Store
        window.location.href = 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate';
      } else {
        // Show download prompt
        window.open('https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate', '_blank');
      }
    }
  };

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{feature} is Premium</p>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <Button onClick={handleUpgrade} size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'dialog') {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{feature} is Premium</CardTitle>
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To subscribe, please purchase from the mobile app. Your subscription will sync across all devices.
          </p>
          
          {pricing && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {pricing.monthly && (
                <div className="p-2 rounded bg-muted">
                  <div className="text-xs font-semibold">{pricing.monthly.displayPrice}</div>
                </div>
              )}
              {pricing.yearly && (
                <div className="p-2 rounded bg-muted">
                  <div className="text-xs font-semibold">{pricing.yearly.displayPrice}</div>
                </div>
              )}
              {pricing.lifetime && (
                <div className="p-2 rounded bg-muted">
                  <div className="text-xs font-semibold">{pricing.lifetime.displayPrice}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleUpgrade} className="flex-1 gap-2">
              <Sparkles className="h-4 w-4" />
              Open App to Upgrade
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default inline variant
  return (
    <div className="text-center py-8 px-4">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
        <Lock className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{feature} is Premium</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <Button onClick={handleUpgrade} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Upgrade to Premium
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UpgradePrompt;

