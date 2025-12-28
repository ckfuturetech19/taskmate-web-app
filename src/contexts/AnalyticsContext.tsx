/* @refresh reload */
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { analyticsService, DailyStats, WeeklyStats, MonthlyStats } from '@/services/analyticsService';

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

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track if we're updating from Firebase to prevent circular updates
  const isUpdatingFromFirebase = React.useRef(false);

  // Use state to track current date and detect changes
  const [currentDate, setCurrentDate] = React.useState(() => analyticsService.formatDate(new Date()));
  
  // Update current date every minute to detect date changes
  useEffect(() => {
    const updateDate = () => {
      const today = new Date();
      const todayStr = analyticsService.formatDate(today);
      setCurrentDate((prev) => {
        if (prev !== todayStr) {
          console.log('📅 Date changed detected:', todayStr, '(was', prev + ')');
          // Reset stats to zero for new date
          setDailyStats(null);
          setIsLoading(true);
        }
        return todayStr;
      });
    };
    
    // Update immediately
    updateDate();
    
    // Check every minute for date changes
    const dateCheckInterval = setInterval(updateDate, 60000);
    
    return () => clearInterval(dateCheckInterval);
  }, []);

  const today = new Date();
  const todayStr = analyticsService.formatDate(today);
  const weekId = analyticsService.getWeekId(today);
  const monthId = analyticsService.getMonthId(today);

  // Set up real-time listeners for analytics data
  // Use currentDate in dependency array so it restarts when date changes
  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    // Use currentDate instead of todayStr to ensure it updates
    const dateStr = currentDate;
    const weekIdCurrent = analyticsService.getWeekId(new Date());
    const monthIdCurrent = analyticsService.getMonthId(new Date());

    console.log('🔄 Setting up real-time listeners for date:', dateStr);

    // Listen to daily stats
    const unsubscribeDaily = analyticsService.subscribeToDailyStats(
      user.uid,
      dateStr,
      (stats) => {
        // Check if date has changed while processing
        const checkDate = analyticsService.formatDate(new Date());
        if (checkDate !== dateStr) {
          console.log('📅 Date changed during callback, ignoring old data');
          return;
        }
        
        if (stats) {
          // Mark that we're updating from Firebase to prevent circular uploads
          // Set flag for longer duration to prevent re-uploads triggered by Firebase updates
          isUpdatingFromFirebase.current = true;
          setDailyStats(stats);
          setIsLoading(false);
          console.log('📥 Received daily stats update from Firebase:', stats.tasksCompleted, 'completed,', stats.tasksCreated, 'created');
          // Reset flag after a delay to prevent immediate re-uploads from TaskContext
          setTimeout(() => {
            isUpdatingFromFirebase.current = false;
          }, 5000); // Increased to 5 seconds to prevent circular updates
        } else {
          // No document exists for this date - reset to zero
          console.log('📭 No daily stats document found for', dateStr, '- resetting to zero');
          setDailyStats({
            userId: user.uid,
            date: dateStr,
            tasksCompleted: 0,
            tasksCreated: 0,
            focusMinutes: 0,
            currentStreak: 0,
            completionRate: 0,
            productivityScore: 0,
            timestamp: null,
            updatedAt: null,
          });
          setIsLoading(false);
        }
      }
    );

    // Listen to weekly stats
    const unsubscribeWeekly = analyticsService.subscribeToWeeklyStats(
      user.uid,
      weekIdCurrent,
      (stats) => {
        setWeeklyStats(stats);
      }
    );

    // Listen to monthly stats
    const unsubscribeMonthly = analyticsService.subscribeToMonthlyStats(
      user.uid,
      monthIdCurrent,
      (stats) => {
        setMonthlyStats(stats);
      }
    );

    return () => {
      unsubscribeDaily();
      unsubscribeWeekly();
      unsubscribeMonthly();
    };
  }, [user?.uid, currentDate]); // Use currentDate so it restarts when date changes

  // Update daily stats
  const updateDailyStats = useCallback(
    async (stats: Partial<Omit<DailyStats, 'userId' | 'date' | 'timestamp' | 'updatedAt'>>) => {
      if (!user?.uid) return;

      const currentDate = analyticsService.formatDate(new Date());
      const currentStats = dailyStats || {
        userId: user.uid,
        date: currentDate,
        tasksCompleted: 0,
        tasksCreated: 0,
        focusMinutes: 0,
        currentStreak: 0,
        completionRate: 0,
        productivityScore: 0,
      };

      const updatedStats = {
        ...currentStats,
        ...stats,
        date: currentDate,
      };

      // Recalculate completion rate if tasks changed
      if (stats.tasksCompleted !== undefined || stats.tasksCreated !== undefined) {
        updatedStats.completionRate =
          updatedStats.tasksCreated > 0
            ? (updatedStats.tasksCompleted / updatedStats.tasksCreated) * 100
            : 0;
      }

      // Always upload - don't block based on Firebase updates
      // The service will handle writing to Firebase correctly
      console.log(`📤 Uploading analytics from web: ${updatedStats.tasksCompleted} completed, ${updatedStats.tasksCreated} created`);
      await analyticsService.uploadDailyStats(user.uid, updatedStats, true);
    },
    [user?.uid, dailyStats]
  );

  // Calculate and upload stats based on current tasks
  const calculateAndUploadStats = useCallback(async () => {
    if (!user?.uid) return;

    // This will be called from TaskContext when tasks change
    // For now, we'll rely on the Flutter app or manual updates
    // You can extend this to calculate from tasks if needed
    console.log('Calculating stats...');
  }, [user?.uid]);

  // Computed values from daily stats
  const tasksCompleted = dailyStats?.tasksCompleted ?? 0;
  const tasksCreated = dailyStats?.tasksCreated ?? 0;
  const focusMinutes = dailyStats?.focusMinutes ?? 0;
  const currentStreak = dailyStats?.currentStreak ?? 0;
  const completionRate = dailyStats?.completionRate ?? 0;
  const productivityScore = dailyStats?.productivityScore ?? 0;

  // Weekly data
  const weeklyCompletionData = weeklyStats?.weeklyCompletionData ?? [];
  const weeklyTasksCreatedData = weeklyStats?.weeklyTasksCreatedData ?? [];

  // Monthly data
  const monthlyTaskCompletionData = monthlyStats?.monthlyTaskCompletionData ?? {};
  const monthlyFocusHoursData = monthlyStats?.monthlyFocusHoursData ?? {};

  const value: AnalyticsContextType = {
    dailyStats,
    tasksCompleted,
    tasksCreated,
    focusMinutes,
    currentStreak,
    completionRate,
    productivityScore,
    weeklyStats,
    weeklyCompletionData,
    weeklyTasksCreatedData,
    monthlyStats,
    monthlyTaskCompletionData,
    monthlyFocusHoursData,
    isLoading,
    updateDailyStats,
    calculateAndUploadStats,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

