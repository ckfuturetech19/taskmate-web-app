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

  // DISABLED: Commented out to prevent web app from overwriting mobile updates
  // The mobile app (Flutter) is the primary source for analytics calculations
  // Web app should only display Firebase data, not calculate and upload
  
  // useEffect(() => {
  //   if (!user?.uid || tasks.length === 0) return;
  //   
  //   // Skip if we just received data from Firebase (within last 5 seconds)
  //   const now = Date.now();
  //   if (now - lastSyncRef.current < 5000) {
  //     return;
  //   }
  //
  //   // Only sync if Firebase data is stale or missing
  //   if (dailyStats && dailyStats.updatedAt) {
  //     const firebaseUpdateTime = dailyStats.updatedAt.toMillis();
  //     const timeSinceUpdate = now - firebaseUpdateTime;
  //     
  //     // If Firebase was updated in last 30 seconds, don't overwrite
  //     if (timeSinceUpdate < 30000) {
  //       return;
  //     }
  //   }
  //
  //   // Calculate today's stats from tasks
  //   const today = new Date();
  //   const todayStr = analyticsService.formatDate(today);
  //
  //   const todayTasks = tasks.filter((task) => {
  //     if (!task.dueDate) return false;
  //     const taskDate = new Date(task.dueDate);
  //     return (
  //       taskDate.getDate() === today.getDate() &&
  //       taskDate.getMonth() === today.getMonth() &&
  //       taskDate.getFullYear() === today.getFullYear()
  //     );
  //   });
  //
  //   const completedToday = todayTasks.filter((t) => t.isCompleted).length;
  //   const createdToday = todayTasks.length;
  //
  //   // Update analytics only if significantly different
  //   if (dailyStats) {
  //     const diff = Math.abs(dailyStats.tasksCompleted - completedToday) + 
  //                  Math.abs(dailyStats.tasksCreated - createdToday);
  //     if (diff === 0) {
  //       return; // No change
  //     }
  //   }
  //
  //   lastSyncRef.current = now;
  //   updateDailyStats({
  //     tasksCompleted: completedToday,
  //     tasksCreated: createdToday,
  //   }).catch((err) => {
  //     console.error('Error updating analytics:', err);
  //   });
  // }, [user?.uid, tasks, updateDailyStats, dailyStats]);
};

