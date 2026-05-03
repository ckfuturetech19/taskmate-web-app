import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/app/AppLayout';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import StatCard from '@/components/dashboard/StatCard';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { CalendarDays, CheckCircle2, Clock, TrendingUp, Flame, Zap } from 'lucide-react';
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
    monthlyTaskCompletionData,
    isLoading,
    dailyStats
  } = useAnalytics();
  
  const { getPersonalTasks } = useTaskContext();
  const personalTasks = getPersonalTasks();

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
        const c = weeklyCompletionData[index];
        const v = weeklyTasksCreatedData[index];
        return {
          name: day,
          completed: typeof c === 'object' ? (c as any)?.y ?? 0 : (c ?? 0),
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
        completed: dayTasks.filter(t => t.isCompleted).length,
        value: dayTasks.length,
      };
    });
  }, [weeklyCompletionData, weeklyTasksCreatedData, personalTasks]);

  if (isLoading) {
    return (
      <AppLayout title="Analytics">
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium text-sm animate-pulse uppercase tracking-widest">Loading stats...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Analytics Dashboard</h2>
            <p className="text-muted-foreground mt-1 font-medium">Real-time performance insights.</p>
          </div>
          {dailyStats?.lastSyncedAt && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Live Sync Active
              </span>
            </div>
          )}
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            subtitle={`${Math.round(stats.completionRate)}% completion rate`}
            variant="primary"
          />
          <StatCard
            title="Current Streak"
            value={stats.streak}
            icon={Flame}
            delay={200}
            subtitle="days in a row"
            trend="up"
          />
          <StatCard
            title="Productivity Score"
            value={Math.round(stats.productivityScore)}
            icon={Zap}
            delay={300}
            subtitle={getProductivityLabel(stats.productivityScore)}
          />
        </div>

        {/* Secondary Detailed Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Focus Time (hours)"
                value={Number((stats.focusMinutes / 60).toFixed(1))}
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
            
            <div className="flex-1">
              <AnalyticsChart
                data={weeklyData}
                type="bar"
                title="Weekly Task Distribution"
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <ProgressDonut
              completed={stats.completed}
              inProgress={0}
              pending={Math.max(0, stats.total - stats.completed)}
              className="h-full"
            />
          </div>
        </div>

        {/* Monthly Retrospective */}
        <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="bg-muted/20 border-b border-border/10 px-6 py-5">
            <CardTitle className="text-lg font-bold uppercase tracking-tight text-foreground/80">Monthly Retrospective</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {Object.keys(monthlyTaskCompletionData).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(monthlyTaskCompletionData).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">{key}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-foreground">{value.toFixed(0)}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h4 className="font-bold text-foreground">No Monthly Data Yet</h4>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Your monthly task breakdowns will appear here over time.</p>
              </div>
            )}
          </CardContent>
        </Card>
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
