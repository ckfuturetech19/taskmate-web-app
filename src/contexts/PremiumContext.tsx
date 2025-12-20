import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { revenueCatService } from '@/services/revenueCatService';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  refreshPremiumStatus: () => Promise<void>;
  pricing: {
    monthly?: {
      identifier: string;
      price: number;
      currency: string;
      period: string;
      displayPrice: string;
    };
    yearly?: {
      identifier: string;
      price: number;
      currency: string;
      period: string;
      displayPrice: string;
    };
    lifetime?: {
      identifier: string;
      price: number;
      currency: string;
      period: string;
      displayPrice: string;
    };
  } | null;
  isLoadingPricing: boolean;
  refreshPricing: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState<PremiumContextType['pricing']>(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);

  const checkPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const premium = await revenueCatService.checkEntitlement();
      setIsPremium(premium);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPricing = async () => {
    try {
      setIsLoadingPricing(true);
      const pricingData = await revenueCatService.getPricing();
      setPricing(pricingData.offerings);
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const refreshPremiumStatus = async () => {
    revenueCatService.clearEntitlementCache();
    await checkPremiumStatus();
  };

  const refreshPricing = async () => {
    revenueCatService.clearPricingCache();
    await loadPricing();
  };

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
      loadPricing();
    } else {
      setIsPremium(false);
      setIsLoading(false);
      setPricing(null);
      setIsLoadingPricing(false);
    }
  }, [user]);

  // Refresh premium status periodically (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkPremiumStatus();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLoading,
        refreshPremiumStatus,
        pricing,
        isLoadingPricing,
        refreshPricing
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

