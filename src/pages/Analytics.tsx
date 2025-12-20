import AppLayout from '@/components/app/AppLayout';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import StatCard from '@/components/dashboard/StatCard';
import { useTaskContext } from '@/contexts/TaskContext';
import { CalendarDays, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { safeIsToday, safeParseDate, safeIsPast } from '@/lib/dateUtils';
import { useMemo } from 'react';

const Analytics = () => {
  const { tasks, getPersonalTasks } = useTaskContext();
  const personalTasks = getPersonalTasks();

  // Calculate statistics
  const stats = useMemo(() => {
    const completed = personalTasks.filter(t => t.completed).length;
    const pending = personalTasks.filter(t => !t.completed).length;
    const today = personalTasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const dueDate = safeParseDate(t.dueDate);
      return dueDate && safeIsToday(dueDate);
    }).length;
    const overdue = personalTasks.filter(t => {
      if (t.completed || !t.dueDate) return false;
      const dueDate = safeParseDate(t.dueDate);
      return dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate);
    }).length;

    return { completed, pending, today, overdue, total: personalTasks.length };
  }, [personalTasks]);

  // Weekly data for bar chart
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayTasks = personalTasks.filter(t => {
        if (!t.dueDate) return false;
        const dueDate = safeParseDate(t.dueDate);
        return dueDate && dueDate >= dayStart && dueDate <= dayEnd;
      });
      
      return {
        name: day,
        completed: dayTasks.filter(t => t.completed).length,
        pending: dayTasks.filter(t => !t.completed).length,
        value: dayTasks.length,
      };
    });
    return weekData;
  }, [personalTasks]);

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
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            delay={200}
          />
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={TrendingUp}
            variant={stats.overdue > 0 ? 'destructive' : undefined}
            delay={300}
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
            inProgress={stats.pending - stats.overdue}
            pending={stats.overdue}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;

