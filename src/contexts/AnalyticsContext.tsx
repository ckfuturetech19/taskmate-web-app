import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { analyticsService, DailyStats, WeeklyStats, MonthlyStats, UserAnalytics } from '@/services/analyticsService';

interface AnalyticsContextType {
  // Daily stats
  dailyStats: DailyStats | null;
  tasksCompleted: number;
  tasksCreated: number;
  focusMinutes: number;
  currentStreak: number;
  completionRate: number;
  productivityScore: number;

  // Weekly stats
  weeklyStats: WeeklyStats | null;
  weeklyCompletionData: Array<{ x: number; y: number }>;
  weeklyTasksCreatedData: Array<{ x: number; y: number }>;

  // Monthly stats
  monthlyStats: MonthlyStats | null;
  monthlyTaskCompletionData: Record<string, number>;
  monthlyFocusHoursData: Record<string, number>;

  // Loading state
  isLoading: boolean;

  // Methods to update stats
  updateDailyStats: (stats: Partial<Omit<DailyStats, 'userId' | 'date' | 'timestamp' | 'updatedAt'>>) => Promise<void>;
  calculateAndUploadStats: () => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const data = await analyticsService.getAnalytics();
    console.log('DEBUG: Analytics Data fetched:', data);
    if (data) setAnalytics(data);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAnalytics(null);
      setIsLoading(false);
      return;
    }

    fetchAnalytics();

    // Setup real-time updates via Pusher
    const unsubscribe = analyticsService.subscribeToAnalytics(user.id, (stats) => {
      console.log('DEBUG: Analytics Real-time update:', stats);
      setAnalytics(stats);
    });

    return () => unsubscribe();
  }, [user, fetchAnalytics]);

  const updateDailyStats = async (stats: Partial<any>) => {
    if (!user) return;
    // Update local state optimistically, properly merging top-level keys if dailyStats is missing
    const currentTopLevelStats = {
      tasksCompleted: (analytics as any)?.tasksCompleted ?? 0,
      tasksCreated: (analytics as any)?.tasksCreated ?? 0,
      focusMinutes: (analytics as any)?.focusMinutes ?? 0,
      currentStreak: (analytics as any)?.currentStreak ?? 0,
      completionRate: (analytics as any)?.completionRate ?? 0,
      productivityScore: (analytics as any)?.productivityScore ?? 0,
      date: (analytics as any)?.date || new Date().toISOString(),
    };
    
    const currentDaily = analytics?.dailyStats || currentTopLevelStats;
    const updatedDaily = { ...currentDaily, ...stats, lastSyncedAt: new Date().toISOString() };
    
    setAnalytics({ ...analytics, dailyStats: updatedDaily } as any);
    await analyticsService.updateAnalytics({ dailyStats: updatedDaily });
  };

  const calculateAndUploadStats = async () => {
    // This is now handled by the backend when tasks are updated
    await fetchAnalytics();
  };

  // Helper to normalize rates (if mobile sends 0.85 instead of 85)
  const normalizeRate = (rate: any) => {
    if (rate === undefined || rate === null) return 0;
    const val = typeof rate === 'string' ? parseFloat(rate) : Number(rate);
    if (isNaN(val)) return 0;
    return val > 0 && val <= 1 ? val * 100 : val;
  };

  const value: AnalyticsContextType = {
    dailyStats: analytics?.dailyStats || null,
    // Support both nested and top-level fields (flexible for mobile app sync)
    tasksCompleted: analytics?.dailyStats?.tasksCompleted ?? (analytics as any)?.tasksCompleted ?? 0,
    tasksCreated: analytics?.dailyStats?.tasksCreated ?? (analytics as any)?.tasksCreated ?? 0,
    focusMinutes: analytics?.dailyStats?.focusMinutes ?? (analytics as any)?.focusMinutes ?? 0,
    currentStreak: analytics?.dailyStats?.currentStreak ?? (analytics as any)?.currentStreak ?? 0,
    completionRate: normalizeRate(analytics?.dailyStats?.completionRate ?? (analytics as any)?.completionRate ?? 0),
    productivityScore: normalizeRate(analytics?.dailyStats?.productivityScore ?? (analytics as any)?.productivityScore ?? 0),
    
    weeklyStats: analytics?.weeklyStats || null,
    weeklyCompletionData: analytics?.weeklyStats?.weeklyCompletionData ?? (analytics as any)?.weeklyCompletionData ?? [],
    weeklyTasksCreatedData: analytics?.weeklyStats?.weeklyTasksCreatedData ?? (analytics as any)?.weeklyTasksCreatedData ?? [],
    
    monthlyStats: analytics?.monthlyStats || null,
    monthlyTaskCompletionData: analytics?.monthlyStats?.monthlyTaskCompletionData ?? (analytics as any)?.monthlyTaskCompletionData ?? {},
    monthlyFocusHoursData: analytics?.monthlyStats?.monthlyFocusHoursData ?? (analytics as any)?.monthlyFocusHoursData ?? {},
    
    isLoading,
    updateDailyStats,
    calculateAndUploadStats,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

