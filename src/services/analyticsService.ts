import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DailyStats {
  userId: string;
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  focusMinutes: number;
  currentStreak: number;
  completionRate: number;
  productivityScore: number;
  timestamp?: Timestamp;
  updatedAt?: Timestamp;
  lastSyncedAt?: string;
}

export interface WeeklyStats {
  userId: string;
  weekId: string;
  weeklyCompletionData: Array<{ x: number; y: number }>;
  weeklyTasksCreatedData: Array<{ x: number; y: number }>;
  timestamp?: Timestamp;
  updatedAt?: Timestamp;
}

export interface MonthlyStats {
  userId: string;
  monthId: string;
  monthlyTaskCompletionData: Record<string, number>;
  monthlyFocusHoursData: Record<string, number>;
  monthlyStats: Array<{
    date: string;
    tasksCompleted: number;
    tasksCreated: number;
    focusMinutes: number;
  }>;
  timestamp?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FocusHours {
  userId: string;
  date: string;
  focusHours: Array<{ hour: number; score: number }>;
  timestamp?: Timestamp;
  updatedAt?: Timestamp;
}

class AnalyticsService {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly DEBOUNCE_DELAY = 2000; // 2 seconds

  /**
   * Debounce function to prevent excessive uploads
   */
  private debounce(key: string, callback: () => void) {
    const existingTimer = this.debounceTimers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      callback();
      this.debounceTimers.delete(key);
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(key, timer);
  }

  /**
   * Format date as YYYY-MM-DD
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get week ID from date (YYYY-WW format)
   */
  getWeekId(date: Date): string {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  /**
   * Get month ID from date (YYYY-MM format)
   */
  getMonthId(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Upload daily stats to Firebase
   */
  async uploadDailyStats(
    userId: string,
    stats: Omit<DailyStats, 'userId' | 'timestamp' | 'updatedAt'>,
    debounce = true
  ): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot upload stats: User not authenticated');
      return;
    }

    if (debounce) {
      this.debounce(`daily_${stats.date}`, async () => {
        await this.uploadDailyStatsNow(userId, stats);
      });
      return;
    }

    await this.uploadDailyStatsNow(userId, stats);
  }

  private async uploadDailyStatsNow(
    userId: string,
    stats: Omit<DailyStats, 'userId' | 'timestamp' | 'updatedAt'>
  ): Promise<void> {
    try {
      const docRef = doc(
        db,
        'analytics',
        'daily_stats',
        'data',
        `${userId}_${stats.date}`
      );

      // Always upload the calculated values directly
      // Firestore merge will update fields, and serverTimestamp ensures accurate timing
      // Real-time listeners on both sides will receive the update immediately
      const statsData: DailyStats = {
        ...stats,
        userId,
        timestamp: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        lastSyncedAt: new Date().toISOString(),
      };

      // Always write - Firestore merge ensures existing fields are preserved if not provided
      // This allows both web and mobile to update their respective fields without conflicts
      await setDoc(docRef, statsData, { merge: true });
      console.log(`✅ Uploaded daily stats for ${stats.date}: ${stats.tasksCompleted} completed, ${stats.tasksCreated} created (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error uploading daily stats:', error);
      throw error;
    }
  }

  /**
   * Upload weekly stats to Firebase
   */
  async uploadWeeklyStats(
    userId: string,
    stats: Omit<WeeklyStats, 'userId' | 'timestamp' | 'updatedAt'>,
    debounce = true
  ): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot upload stats: User not authenticated');
      return;
    }

    if (debounce) {
      this.debounce(`weekly_${stats.weekId}`, async () => {
        await this.uploadWeeklyStatsNow(userId, stats);
      });
      return;
    }

    await this.uploadWeeklyStatsNow(userId, stats);
  }

  private async uploadWeeklyStatsNow(
    userId: string,
    stats: Omit<WeeklyStats, 'userId' | 'timestamp' | 'updatedAt'>
  ): Promise<void> {
    try {
      const docRef = doc(
        db,
        'analytics',
        'weekly_stats',
        'data',
        `${userId}_${stats.weekId}`
      );

      const statsData: WeeklyStats = {
        ...stats,
        userId,
        timestamp: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      await setDoc(docRef, statsData, { merge: true });
      console.log(`✅ Uploaded weekly stats for week ${stats.weekId} (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error uploading weekly stats:', error);
      throw error;
    }
  }

  /**
   * Upload monthly stats to Firebase
   */
  async uploadMonthlyStats(
    userId: string,
    stats: Omit<MonthlyStats, 'userId' | 'timestamp' | 'updatedAt'>,
    debounce = true
  ): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot upload stats: User not authenticated');
      return;
    }

    if (debounce) {
      this.debounce(`monthly_${stats.monthId}`, async () => {
        await this.uploadMonthlyStatsNow(userId, stats);
      });
      return;
    }

    await this.uploadMonthlyStatsNow(userId, stats);
  }

  private async uploadMonthlyStatsNow(
    userId: string,
    stats: Omit<MonthlyStats, 'userId' | 'timestamp' | 'updatedAt'>
  ): Promise<void> {
    try {
      const docRef = doc(
        db,
        'analytics',
        'monthly_stats',
        'data',
        `${userId}_${stats.monthId}`
      );

      const statsData: MonthlyStats = {
        ...stats,
        userId,
        timestamp: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      await setDoc(docRef, statsData, { merge: true });
      console.log(`✅ Uploaded monthly stats for month ${stats.monthId} (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error uploading monthly stats:', error);
      throw error;
    }
  }

  /**
   * Get daily stats (one-time fetch, not real-time)
   */
  async getDailyStats(userId: string, date: string): Promise<DailyStats | null> {
    try {
      const docRef = doc(db, 'analytics', 'daily_stats', 'data', `${userId}_${date}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as DailyStats;
      }
      return null;
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      return null;
    }
  }

  /**
   * Increment task completion count (atomic operation, matches Flutter logic)
   * Uses Firestore increment to prevent conflicts between web and mobile
   */
  async incrementTaskCompletion(userId: string, date: string): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot increment stats: User not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'analytics', 'daily_stats', 'data', `${userId}_${date}`);
      
      // Use atomic increment to prevent conflicts
      await setDoc(
        docRef,
        {
          userId,
          date,
          tasksCompleted: increment(1),
          updatedAt: serverTimestamp(),
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      // Recalculate completion rate after increment
      const currentStats = await this.getDailyStats(userId, date);
      if (currentStats && currentStats.tasksCreated > 0) {
        const newCompletionRate = (currentStats.tasksCompleted / currentStats.tasksCreated) * 100;
        await setDoc(
          docRef,
          {
            completionRate: newCompletionRate,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      console.log(`✅ Incremented task completion for ${date} (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error incrementing task completion:', error);
      throw error;
    }
  }

  /**
   * Increment task creation count (atomic operation, matches Flutter logic)
   * Uses Firestore increment to prevent conflicts between web and mobile
   */
  async incrementTaskCreation(userId: string, date: string): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot increment stats: User not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'analytics', 'daily_stats', 'data', `${userId}_${date}`);
      
      // Use atomic increment to prevent conflicts
      await setDoc(
        docRef,
        {
          userId,
          date,
          tasksCreated: increment(1),
          updatedAt: serverTimestamp(),
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      // Recalculate completion rate after increment
      const currentStats = await this.getDailyStats(userId, date);
      if (currentStats && currentStats.tasksCreated > 0) {
        const newCompletionRate = (currentStats.tasksCompleted / currentStats.tasksCreated) * 100;
        await setDoc(
          docRef,
          {
            completionRate: newCompletionRate,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      console.log(`✅ Incremented task creation for ${date} (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error incrementing task creation:', error);
      throw error;
    }
  }

  /**
   * Decrement task completion count (when task is uncompleted)
   * Uses Firestore increment(-1) for atomic operation
   */
  async decrementTaskCompletion(userId: string, date: string): Promise<void> {
    if (!userId) {
      console.warn('⚠️ Cannot decrement stats: User not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'analytics', 'daily_stats', 'data', `${userId}_${date}`);
      
      // Use atomic decrement (increment by -1) to prevent conflicts
      await setDoc(
        docRef,
        {
          userId,
          date,
          tasksCompleted: increment(-1),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Recalculate completion rate after decrement
      const currentStats = await this.getDailyStats(userId, date);
      if (currentStats && currentStats.tasksCreated > 0) {
        const newCompletionRate = Math.max(0, (currentStats.tasksCompleted / currentStats.tasksCreated) * 100);
        await setDoc(
          docRef,
          {
            completionRate: newCompletionRate,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      console.log(`✅ Decremented task completion for ${date} (userId: ${userId})`);
    } catch (error) {
      console.error('❌ Error decrementing task completion:', error);
      throw error;
    }
  }

  /**
   * Get daily stats with real-time listener
   */
  subscribeToDailyStats(
    userId: string,
    date: string,
    callback: (stats: DailyStats | null) => void
  ): () => void {
    const docRef = doc(db, 'analytics', 'daily_stats', 'data', `${userId}_${date}`);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as DailyStats);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to daily stats:', error);
        callback(null);
      }
    );
  }

  /**
   * Get weekly stats with real-time listener
   */
  subscribeToWeeklyStats(
    userId: string,
    weekId: string,
    callback: (stats: WeeklyStats | null) => void
  ): () => void {
    const docRef = doc(db, 'analytics', 'weekly_stats', 'data', `${userId}_${weekId}`);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as WeeklyStats);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to weekly stats:', error);
        callback(null);
      }
    );
  }

  /**
   * Get monthly stats with real-time listener
   */
  subscribeToMonthlyStats(
    userId: string,
    monthId: string,
    callback: (stats: MonthlyStats | null) => void
  ): () => void {
    const docRef = doc(db, 'analytics', 'monthly_stats', 'data', `${userId}_${monthId}`);

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as MonthlyStats);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('Error listening to monthly stats:', error);
        callback(null);
      }
    );
  }

  /**
   * Cleanup debounce timers
   */
  cleanup() {
    this.debounceTimers.forEach((timer) => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}

export const analyticsService = new AnalyticsService();

