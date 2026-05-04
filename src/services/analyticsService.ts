import api from '@/services/apiService';
import { socketService } from '@/services/socketService';

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  tasksCreated: number;
  focusMinutes: number;
  currentStreak: number;
  completionRate: number;
  productivityScore: number;
  lastSyncedAt?: string;
}

export interface WeeklyStats {
  weekId: string;
  weeklyCompletionData: Array<{ x: number; y: number }>;
  weeklyTasksCreatedData: Array<{ x: number; y: number }>;
}

export interface MonthlyStats {
  monthId: string;
  monthlyTaskCompletionData: Record<string, number>;
  monthlyFocusHoursData: Record<string, number>;
  monthlyStats: Array<{
    date: string;
    tasksCompleted: number;
    tasksCreated: number;
    focusMinutes: number;
  }>;
}

export interface UserAnalytics {
  dailyStats?: DailyStats;
  weeklyStats?: WeeklyStats;
  monthlyStats?: MonthlyStats;
  focusHours?: any;
}

class AnalyticsService {
  private currentStats: UserAnalytics | null = null;

  async getAnalytics(): Promise<UserAnalytics | null> {
    try {
      const response = await api.get('/analytics');
      this.currentStats = response.data;
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }

  async updateAnalytics(stats: Partial<UserAnalytics>): Promise<void> {
    try {
      await api.put('/analytics', stats);
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }

  subscribeToAnalytics(userId: string, callback: (stats: UserAnalytics) => void): () => void {
    socketService.joinUserRoom(userId);
    socketService.on('stats-updated', callback);

    return () => {
      socketService.off('stats-updated', callback);
    };
  }

  // Helper methods for date formatting
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getWeekId(date: Date): string {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  getMonthId(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

export const analyticsService = new AnalyticsService();

