import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

const functions = getFunctions(app);

interface PricingOffering {
  identifier: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'lifetime';
  displayPrice: string;
}

interface PricingResponse {
  success: boolean;
  offerings: {
    monthly?: PricingOffering;
    yearly?: PricingOffering;
    lifetime?: PricingOffering;
  };
  isStatic?: boolean;
  error?: string;
}

interface EntitlementResponse {
  success: boolean;
  isPremium: boolean;
  entitlement?: any;
  reason?: string;
  error?: string;
}

class RevenueCatService {
  private pricingCache: PricingResponse | null = null;
  private pricingCacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private entitlementCache: { isPremium: boolean; timestamp: number } | null = null;
  private readonly ENTITLEMENT_CACHE_DURATION = 60 * 1000; // 1 minute

  /**
   * Get pricing plans from RevenueCat (via Firebase Function)
   * Returns same pricing as mobile app
   */
  async getPricing(): Promise<PricingResponse> {
    // Check cache first
    const now = Date.now();
    if (this.pricingCache && (now - this.pricingCacheTime) < this.CACHE_DURATION) {
      return this.pricingCache;
    }

    try {
      const getPricing = httpsCallable(functions, 'getPricing');
      const result = await getPricing();
      const data = result.data as PricingResponse;
      
      this.pricingCache = data;
      this.pricingCacheTime = now;
      
      return data;
    } catch (error: any) {
      console.error('Error fetching pricing:', error);
      
      // Return static fallback pricing
      return {
        success: true,
        offerings: {
          monthly: {
            identifier: 'pro_monthly',
            price: 99,
            currency: 'INR',
            period: 'monthly',
            displayPrice: '₹99/month'
          },
          yearly: {
            identifier: 'pro_yearly',
            price: 799,
            currency: 'INR',
            period: 'yearly',
            displayPrice: '₹799/year'
          },
          lifetime: {
            identifier: 'pro_lifetime',
            price: 1299,
            currency: 'INR',
            period: 'lifetime',
            displayPrice: '₹1299 (one-time)'
          }
        },
        isStatic: true,
        error: error.message
      };
    }
  }

  /**
   * Check if user has premium entitlement
   */
  async checkEntitlement(): Promise<boolean> {
    // Check cache first
    const now = Date.now();
    if (this.entitlementCache && (now - this.entitlementCache.timestamp) < this.ENTITLEMENT_CACHE_DURATION) {
      return this.entitlementCache.isPremium;
    }

    try {
      const checkEntitlement = httpsCallable(functions, 'checkEntitlement');
      const result = await checkEntitlement();
      const data = result.data as EntitlementResponse;
      
      const isPremium = data.success && data.isPremium === true;
      
      // Update cache
      this.entitlementCache = {
        isPremium,
        timestamp: now
      };
      
      return isPremium;
    } catch (error: any) {
      console.error('Error checking entitlement:', error);
      return false;
    }
  }

  /**
   * Clear entitlement cache (call after purchase or subscription change)
   */
  clearEntitlementCache() {
    this.entitlementCache = null;
  }

  /**
   * Clear pricing cache
   */
  clearPricingCache() {
    this.pricingCache = null;
    this.pricingCacheTime = 0;
  }
}

export const revenueCatService = new RevenueCatService();

