import { ReactNode } from 'react';
import { usePremium } from '@/contexts/PremiumContext';
import UpgradePrompt from './UpgradePrompt';

interface PremiumGateProps {
  children: ReactNode;
  feature: string;
  description?: string;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  variant?: 'dialog' | 'inline' | 'banner';
}

const PremiumGate = ({ 
  children, 
  feature, 
  description,
  fallback,
  showUpgradePrompt = true,
  variant = 'inline'
}: PremiumGateProps) => {
  const { isPremium, isLoading } = usePremium();

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!isPremium) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showUpgradePrompt) {
      return <UpgradePrompt feature={feature} description={description} variant={variant} />;
    }
    
    return null;
  }

  return <>{children}</>;
};

export default PremiumGate;

