import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/app/AppLayout';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import StatCard from '@/components/dashboard/StatCard';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { CalendarDays, CheckCircle2, Clock, TrendingUp, Flame, Zap, BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAnalyticsSync } from '@/hooks/useAnalyticsSync';
import { cn } from '@/lib/utils';

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
    isLoading,
    dailyStats
  } = useAnalytics();
  
  const { getPersonalTasks } = useTaskContext();
  const personalTasks = getPersonalTasks();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M'>('7D');
  
  useAnalyticsSync();

  const taskStats = useMemo(() => {
    const completed = personalTasks.filter(t => t.isCompleted).length;
    const total = personalTasks.length;
    return { completed, total };
  }, [personalTasks]);

  const stats = {
    completed: Math.max(tasksCompleted, taskStats.completed),
    total: Math.max(tasksCreated, taskStats.total),
    streak: currentStreak,
    completionRate: completionRate,
    productivityScore: productivityScore,
    focusMinutes: focusMinutes,
  };

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (weeklyCompletionData.length > 0) {
      return days.map((day, index) => {
        const v = weeklyTasksCreatedData[index];
        return {
          name: day,
          value: typeof v === 'object' ? (v as any)?.y ?? 0 : (v ?? 0),
        };
      });
    }

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
        value: dayTasks.length,
      };
    });
  }, [weeklyCompletionData, weeklyTasksCreatedData, personalTasks]);

  if (isLoading) {
    return (
      <AppLayout title="Analytics">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <div className="w-10 h-10 border-4 border-[var(--brand-pink)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--text-muted)] font-medium text-sm animate-pulse">Loading stats...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics">
      <div className="space-y-6 pb-12">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between border-b border-[var(--border-default)] pb-4">
          <div>
            <h1 className="text-[24px] font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
            <p className="text-[13px] text-[var(--text-muted)]">Real-time performance insights</p>
          </div>
          {dailyStats?.lastSyncedAt && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-[var(--status-success)]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
              <span>Live Synced</span>
            </div>
          )}
        </div>

        {/* Top row (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={CalendarDays}
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            trend="up"
            trendValue={12}
            variant="accent"
            delay={50}
          />
          <StatCard
            title="Current Streak"
            value={stats.streak}
            icon={Flame}
            variant="purple"
            delay={100}
          />
          <StatCard
            title="Productivity Score"
            value={Math.round(stats.productivityScore)}
            icon={Zap}
            variant="default"
            delay={150}
          />
        </div>

        {/* Second Row: 2 cards + Donut progress */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                title="Focus Time"
                value={`${(stats.focusMinutes / 60).toFixed(1)} hrs`}
                icon={Clock}
                variant="purple"
                delay={200}
              />
              <StatCard
                title="Completion Rate"
                value={`${Math.round(stats.completionRate)}%`}
                icon={TrendingUp}
                variant="accent"
                delay={250}
              />
            </div>

            {/* Task Activity Chart */}
            <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] p-6 flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-[16px] text-[var(--text-primary)]">Task Activity</h3>
                  <p className="text-[12px] text-[var(--text-muted)]">Historical task metrics</p>
                </div>
                
                {/* Time range selector pills */}
                <div className="flex bg-[var(--bg-base)] p-1 rounded-full border border-[var(--border-default)]">
                  {(['7D', '30D', '3M'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-200",
                        timeRange === range
                          ? "bg-[var(--brand-gradient)] text-white shadow-sm"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[220px] w-full">
                {stats.total === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 border border-dashed border-[var(--border-default)] rounded-[12px]">
                    <BarChart3 className="h-8 w-8 text-[var(--text-muted)] mb-2" />
                    <p className="text-[13px] text-[var(--text-muted)]">No data yet. Complete tasks to see insights.</p>
                  </div>
                ) : (
                  <AnalyticsChart
                    data={weeklyData}
                    type="bar"
                    strokeColor="#7B2FBE"
                  />
                )}
              </div>
            </Card>
          </div>

          <div>
            <ProgressDonut
              completed={stats.completed}
              inProgress={0}
              pending={Math.max(0, stats.total - stats.completed)}
              className="h-full"
            />
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Analytics;
