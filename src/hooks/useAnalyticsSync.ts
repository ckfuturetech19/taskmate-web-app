import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { analyticsService } from '@/services/analyticsService';

/**
 * Hook to sync analytics when tasks change
 * DISABLED: Firebase is the source of truth, mobile app handles task-based analytics
 * This hook is kept for potential future use but won't auto-sync to prevent conflicts
 */
export const useAnalyticsSync = () => {
  const { user } = useAuth();
  const { tasks } = useTaskContext();
  const { updateDailyStats, dailyStats } = useAnalytics();
  const lastSyncRef = useRef<number>(0);

  useEffect(() => {
    if (!user?.id || tasks.length === 0) return;
    
    // Skip if we just received data from Firebase/Backend (within last 5 seconds)
    const now = Date.now();
    if (now - lastSyncRef.current < 5000) {
      return;
    }

    // Only sync if backend data is stale or missing
    if (dailyStats && dailyStats.lastSyncedAt) {
      const backendUpdateTime = new Date(dailyStats.lastSyncedAt).getTime();
      const timeSinceUpdate = now - backendUpdateTime;
      
      // If Backend was updated in last 30 seconds by another device, don't overwrite immediately
      if (timeSinceUpdate < 30000) {
        return;
      }
    }

    // Calculate today's stats from tasks
    const today = new Date();

    const todayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });

    const completedToday = todayTasks.filter((t) => t.isCompleted).length;
    const createdToday = todayTasks.length;
    
    let currentCompletionRate = dailyStats?.completionRate ?? 0;
    let currentProductivityScore = dailyStats?.productivityScore ?? 0;
    
    if (createdToday > 0) {
      currentCompletionRate = (completedToday / createdToday) * 100;
      // Simple productivity formula for web fallback
      currentProductivityScore = Math.min(100, (currentCompletionRate * 0.8) + (completedToday * 2));
    }

    // Update analytics only if significantly different
    if (dailyStats) {
      const diff = Math.abs((dailyStats.tasksCompleted ?? 0) - completedToday) + 
                   Math.abs((dailyStats.tasksCreated ?? 0) - createdToday);
      if (diff === 0) {
        return; // No change
      }
    }

    lastSyncRef.current = now;
    
    updateDailyStats({
      tasksCompleted: completedToday,
      tasksCreated: createdToday,
      completionRate: currentCompletionRate,
      productivityScore: currentProductivityScore,
    }).catch((err) => {
      console.error('Error updating analytics:', err);
    });
  }, [user?.id, tasks, updateDailyStats, dailyStats]);
};

