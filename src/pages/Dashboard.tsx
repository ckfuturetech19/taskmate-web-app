import { useState, useMemo } from 'react';
import AppLayout from '@/components/app/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import RemindersCard from '@/components/dashboard/RemindersCard';
import TimeTrackerCard from '@/components/dashboard/TimeTrackerCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAnalyticsSync } from '@/hooks/useAnalyticsSync';
import { Task } from '@/types/task';
import { CalendarDays, CheckCircle2, Plus, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { safeIsToday, safeParseDate, safeIsPast } from '@/lib/dateUtils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { usePremium } from '@/contexts/PremiumContext';
import { UpgradePromptDialog } from '@/components/premium/UpgradePromptDialog';

const Dashboard = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const { tasksCompleted, tasksCreated, currentStreak, completionRate: analyticsCompletionRate } = useAnalytics();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('today');

  useAnalyticsSync();

  const personalTasks = getPersonalTasks();

  const todaysTasks = personalTasks.filter(task => {
    if (task.isCompleted || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && safeIsToday(dueDate);
  });

  const overdueTasks = personalTasks.filter(task => {
    if (task.isCompleted || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate);
  });

  const upcomingTasks = personalTasks.filter(task => {
    if (task.isCompleted || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && !safeIsPast(dueDate) && !safeIsToday(dueDate);
  }).slice(0, 5);

  const pendingTasks = personalTasks.filter(task => !task.isCompleted);

  const totalCompleted = Math.max(tasksCompleted, personalTasks.filter(t => t.isCompleted).length);
  const totalCreated = Math.max(tasksCreated, personalTasks.length);
  const displayCompletionRate = Math.max(analyticsCompletionRate, totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 0);

  const handleSaveTask = async (data: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
    try {
      if (editingTask) {
        if (!editingTask.id) return;
        await updateTask(editingTask.id, data);
        toast({ title: 'Task updated successfully' });
      } else {
        await addTask(data);
        toast({ title: 'Task added successfully' });
      }
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({ title: 'Failed to save task', variant: 'destructive' });
    } finally {
      setEditingTask(null);
      setDialogOpen(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Greeting based on user's LOCAL time (new Date() already uses device timezone)
  const getGreeting = () => {
    const hour = new Date().getHours(); // 0-23, local timezone
    if (hour >= 5 && hour < 12)  return { text: 'Good morning',   emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
    if (hour >= 17 && hour < 21) return { text: 'Good evening',   emoji: '🌆' };
    return                                { text: 'Good night',    emoji: '🌙' };
  };
  const greeting = getGreeting();

  return (
    <AppLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6 pb-10"
      >
        {/* Compact Greeting Bar — animated 4-color gradient border ring */}
        <div className="gradient-ring-card rounded-[12px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          {/* Subtle inner wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF3CAC]/4 via-transparent to-[#7B2FBE]/4 pointer-events-none rounded-[12px]" />

          <div className="relative">
            <h1 className="text-[20px] font-semibold text-[var(--text-primary)] leading-tight">
              {greeting.text}, {user?.name || 'User'} {greeting.emoji}{' '}
              <span className="text-[14px] font-normal text-[var(--text-secondary)] ml-1">
                You have {todaysTasks.length} tasks today
              </span>
            </h1>
            <p className="text-[13px] text-[var(--text-muted)] mt-0.5">{formattedDate}</p>
          </div>

          <Button
            onClick={() => {
              if (!isPremium) { setIsUpgradeOpen(true); } else { setDialogOpen(true); }
            }}
            className="rounded-full text-white text-[13px] font-semibold h-9 px-5 border-0 shrink-0 relative hover:brightness-110 transition-all"
            style={{ background: 'linear-gradient(135deg, #FF3CAC 0%, #7B2FBE 100%)' }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>

        {/* Standardized Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={totalCreated}
            icon={CheckCircle2}
            variant="primary"
            trend="up"
            trendValue={12}
            delay={50}
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon={Clock}
            variant="destructive"
            delay={100}
          />
          <StatCard
            title="Completion Rate"
            value={`${Math.round(displayCompletionRate)}%`}
            icon={CheckCircle2}
            variant="accent"
            delay={150}
          />
          <StatCard
            title="Daily Streak"
            value={currentStreak}
            icon={TrendingUp}
            variant="purple"
            delay={200}
          />
        </div>

        {/* 3-Panel Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.8fr] gap-4 items-stretch min-h-[320px]">
          {/* Panel 1: Productivity Wave */}
          <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="font-semibold text-[16px] text-[var(--text-primary)]">
                Productivity Wave
              </h3>
              <p className="text-[12px] text-[var(--text-muted)]">
                Last 7 days
              </p>
            </div>
            <div className="flex-1 min-h-[180px]">
              <AnalyticsChart
                type="area"
                strokeColor="#00C9A7"
                data={useMemo(() => {
                  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                  const today = new Date();
                  return days.map((day, index) => {
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
                      value: dayTasks.length,
                    };
                  });
                }, [personalTasks])}
              />
            </div>
          </Card>

          {/* Panel 2: Focus Timers */}
          <RemindersCard 
            tasks={personalTasks} 
            onAddTask={() => {
              if (!isPremium) {
                setIsUpgradeOpen(true);
              } else {
                setDialogOpen(true);
              }
            }} 
          />

          {/* Panel 3: Clock widget / Time */}
          <TimeTrackerCard />
        </div>

        {/* Bottom Task Matrix Section */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4 pt-4"
        >
          <Tabs defaultValue="today" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 bg-[var(--bg-card)] p-4 rounded-[16px] border border-[var(--border-default)]">
              <h3 className="font-semibold text-[18px] text-[var(--text-primary)]">Task Board</h3>
              
              <TabsList className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-full h-9 p-1 shrink-0 flex">
                <TabsTrigger value="today" className="rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Today</TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Upcoming</TabsTrigger>
                <TabsTrigger value="overdue" className="rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Overdue</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="today" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {todaysTasks.length > 0 ? (
                  todaysTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] border-dashed rounded-[16px] p-12 text-center col-span-full shadow-sm">
                    <div className="h-14 w-14 bg-[var(--bg-base)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-7 w-7 text-[var(--brand-pink)]" />
                    </div>
                    <h4 className="font-semibold text-[16px] text-[var(--text-primary)]">All Done!</h4>
                    <p className="text-[13px] text-[var(--text-muted)] mt-1">No pending tasks for today.</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] border-dashed rounded-[16px] p-12 text-center col-span-full shadow-sm">
                    <div className="h-14 w-14 bg-[var(--bg-base)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="h-7 w-7 text-[var(--brand-pink)]" />
                    </div>
                    <h4 className="font-semibold text-[16px] text-[var(--text-primary)]">No Upcoming Tasks</h4>
                    <p className="text-[13px] text-[var(--text-muted)] mt-1">There are no upcoming tasks scheduled.</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="overdue" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-[var(--bg-card)] border border-[var(--border-default)] border-dashed rounded-[16px] p-12 text-center col-span-full shadow-sm">
                    <div className="h-14 w-14 bg-[var(--bg-base)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-7 w-7 text-[var(--status-danger)]" />
                    </div>
                    <h4 className="font-semibold text-[16px] text-[var(--text-primary)]">No Overdue Tasks</h4>
                    <p className="text-[13px] text-[var(--text-muted)] mt-1">Great job! You have no overdue tasks.</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          task={editingTask}
          onSave={handleSaveTask}
        />

        <UpgradePromptDialog
          open={isUpgradeOpen}
          onOpenChange={setIsUpgradeOpen}
        />
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
