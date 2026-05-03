import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  refreshPremiumStatus: () => Promise<void>;
  plans: {
    id: string;
    name: string;
    tag?: string;
  }[];
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsPremium(user.isPro);
    } else {
      setIsPremium(false);
    }
  }, [user]);

  const plans = [
    { id: 'free', name: 'Free', tag: 'forever' },
    { id: 'monthly', name: 'Premium Monthly', tag: 'Best for trying' },
    { id: 'yearly', name: 'Premium Yearly', tag: 'Save more with annual' },
    { id: 'lifetime', name: 'Premium Lifetime', tag: 'One-time payment' },
  ];

  const refreshPremiumStatus = async () => {
    // AuthContext handles profile refresh which includes isPro status
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        isLoading,
        refreshPremiumStatus,
        plans,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

