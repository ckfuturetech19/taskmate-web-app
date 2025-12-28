import AppLayout from '@/components/app/AppLayout';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import StatCard from '@/components/dashboard/StatCard';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { CalendarDays, CheckCircle2, Clock, TrendingUp, Flame, Zap } from 'lucide-react';
import { useMemo, useEffect } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { useAnalyticsSync } from '@/hooks/useAnalyticsSync';

const Analytics = () => {
  const { 
    tasksCompleted, 
    tasksCreated, 
    focusMinutes, 
    currentStreak, 
    completionRate, 
    productivityScore,
    weeklyCompletionData,
    weeklyTasksCreatedData,
    monthlyTaskCompletionData,
    isLoading,
    dailyStats
  } = useAnalytics();
  
  const { getPersonalTasks } = useTaskContext();
  const personalTasks = getPersonalTasks();

  // Sync analytics when tasks change
  useAnalyticsSync();

  // Calculate statistics from tasks as fallback
  const taskStats = useMemo(() => {
    const completed = personalTasks.filter(t => t.isCompleted).length;
    const total = personalTasks.length;

    return { completed, total };
  }, [personalTasks]);

  // Sync analytics when tasks change
  useEffect(() => {
    // Use Firebase stats if available, otherwise use task stats
    const shouldUpdate = dailyStats && (
      dailyStats.tasksCompleted !== taskStats.completed ||
      dailyStats.tasksCreated !== taskStats.total
    );

    if (shouldUpdate && dailyStats) {
      // Update will happen through real-time sync automatically
      // But we can ensure local stats are in sync
      console.log('Analytics data synced from Firebase');
    }
  }, [personalTasks, dailyStats, taskStats]);

  // Weekly data for chart - use Firebase data if available, otherwise calculate from tasks
  const weeklyData = useMemo(() => {
    if (weeklyCompletionData.length > 0 && weeklyTasksCreatedData.length > 0) {
      // Use Firebase data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days.map((day, index) => {
        const completion = weeklyCompletionData[index]?.y ?? 0;
        const created = weeklyTasksCreatedData[index]?.y ?? 0;
      return {
        name: day,
        completed: completion,
        value: created,
      };
      });
    }

    // Fallback: Calculate from tasks
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayTasks = personalTasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate >= dayStart && dueDate <= dayEnd;
      });
      
      return {
        name: day,
        completed: dayTasks.filter(t => t.isCompleted).length,
        value: dayTasks.length,
      };
    });
  }, [weeklyCompletionData, weeklyTasksCreatedData, personalTasks]);

  // Use Firebase stats if available, otherwise use calculated stats
  const stats = {
    completed: tasksCompleted > 0 ? tasksCompleted : taskStats.completed,
    total: tasksCreated > 0 ? tasksCreated : taskStats.total,
    streak: currentStreak,
    completionRate: completionRate,
    productivityScore: productivityScore,
    focusMinutes: focusMinutes,
  };

  if (isLoading) {
    return (
      <AppLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={CalendarDays}
            delay={0}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            trend="up"
            delay={100}
            subtitle={`${stats.completionRate.toFixed(1)}% completion rate`}
          />
          <StatCard
            title="Current Streak"
            value={stats.streak}
            icon={Flame}
            delay={200}
            subtitle="days in a row"
          />
          <StatCard
            title="Productivity Score"
            value={Math.round(stats.productivityScore)}
            icon={Zap}
            delay={300}
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Focus Time (hours)"
            value={Math.floor(stats.focusMinutes / 60)}
            icon={Clock}
            delay={400}
          />
          <StatCard
            title="Completion Rate"
            value={Math.round(stats.completionRate)}
            icon={TrendingUp}
            delay={500}
            subtitle="%"
            variant={stats.completionRate >= 75 ? undefined : stats.completionRate >= 50 ? 'default' : 'destructive'}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            data={weeklyData}
            type="bar"
            title="Weekly Task Analytics"
          />
          <ProgressDonut
            completed={stats.completed}
            inProgress={0}
            pending={0}
          />
        </div>

        {/* Monthly Stats Section */}
        {Object.keys(monthlyTaskCompletionData).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Task Completion</h4>
                <div className="space-y-2">
                  {Object.entries(monthlyTaskCompletionData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}</span>
                      <span className="font-semibold">{value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Sync Indicator */}
        {dailyStats && (
          <div className="text-sm text-muted-foreground text-center pt-4">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Synced in real-time with mobile app
              {dailyStats.lastSyncedAt && (
                <span className="text-xs">
                  (Last sync: {new Date(dailyStats.lastSyncedAt).toLocaleTimeString()})
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

function getProductivityLabel(score: number): string {
  if (score >= 75) return 'Excellent';
  if (score >= 50) return 'Good';
  if (score >= 25) return 'Average';
  return 'Low';
}

export default Analytics;
