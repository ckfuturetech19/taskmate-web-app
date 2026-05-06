import { useState, useMemo, useRef } from 'react';
import AppLayout from '@/components/app/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import RemindersCard from '@/components/dashboard/RemindersCard';
import TimeTrackerCard from '@/components/dashboard/TimeTrackerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useAnalyticsSync } from '@/hooks/useAnalyticsSync';
import { Task } from '@/types/task';
import { CalendarDays, Clock, CheckCircle2, Plus, TrendingUp, AlertCircle, FileDown, Sparkles, Zap, BarChart3 } from 'lucide-react';
import { safeIsToday, safeParseDate, safeIsPast } from '@/lib/dateUtils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const { tasksCompleted, tasksCreated, currentStreak, completionRate: analyticsCompletionRate } = useAnalytics();

  const [dialogOpen, setDialogOpen] = useState(false);
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
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  return (
    <AppLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6 pb-10"
      >

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
              <Zap className="h-3 w-3" />
              <span>Strategic Command Hub</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              Intelligence <span className="text-primary">Restored.</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-md italic border-l-2 border-primary/20 pl-4">
              Analyzing <span className="text-foreground font-bold">{todaysTasks.length} active objectives</span> for today. Operational readiness is 100%.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-3 shrink-0"
          >
            <Button
              onClick={() => setDialogOpen(true)}
              size="lg"
              className="rounded-2xl px-8 h-14 font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-sm tracking-widest"
            >
              <Plus className="h-5 w-5 mr-2" />
              INITIATE TASK
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Operation Volume"
            value={totalCreated}
            icon={Zap}
            variant="primary"
            trend="up"
            trendValue={12}
            delay={100}
          />
          <StatCard
            title="Critical Payload"
            value={pendingTasks.length}
            icon={Clock}
            subtitle={`${pendingTasks.length} tasks to go`}
            variant="destructive"
            delay={200}
          />
          <StatCard
            title="Combat Efficiency"
            value={`${Math.round(displayCompletionRate)}%`}
            icon={CheckCircle2}
            variant="accent"
            subtitle="Efficiency score"
            delay={300}
          />
          <StatCard
            title="Operational Continuity"
            value={currentStreak}
            icon={TrendingUp}
            variant="purple"
            subtitle={currentStreak > 0 ? `${currentStreak} day streak!` : "Start today"}
            delay={400}
          />
        </div>

        {/* Top Row - Intelligence Grid (3 Side-by-Side with Same Height) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* 1. Productivity Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-[2.5rem] border-white/10 overflow-hidden flex flex-col h-[380px]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-black text-sm tracking-tight flex items-center gap-2 uppercase italic text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Productivity Wave
              </h3>
            </div>
            <div className="p-6 flex-1 min-h-0">
              <AnalyticsChart
                type="bar"
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
                      completed: dayTasks.filter(t => t.isCompleted).length,
                      pending: dayTasks.filter(t => !t.isCompleted).length,
                      value: dayTasks.length,
                    };
                  });
                }, [personalTasks])}
              />
            </div>
          </motion.div>

          {/* 2. Reminders Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="h-[380px] flex flex-col"
          >
            <RemindersCard 
              tasks={personalTasks} 
              onAddTask={() => setDialogOpen(true)} 
              onStartTimer={(t) => console.log(t)} 
              className="flex-1 rounded-[2.5rem]"
            />
          </motion.div>

          {/* 3. Time Tracker Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="h-[380px] flex flex-col"
          >
            <TimeTrackerCard className="flex-1 rounded-[2.5rem]" />
          </motion.div>
        </div>

        {/* Bottom Row - Full Width Task Matrix */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Tabs defaultValue="today" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 px-4 bg-white/5 p-4 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                <h3 className="font-black text-2xl tracking-tighter uppercase italic">Task Matrix</h3>
              </div>
              <TabsList className="bg-white/5 border border-white/10 rounded-2xl h-12 p-1 min-w-[300px]">
                <TabsTrigger value="today" className="flex-1 rounded-xl px-6 text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black tracking-[0.2em]">TODAY</TabsTrigger>
                <TabsTrigger value="upcoming" className="flex-1 rounded-xl px-6 text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black tracking-[0.2em]">UPCOMING</TabsTrigger>
                <TabsTrigger value="overdue" className="flex-1 rounded-xl px-6 text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black tracking-[0.2em]">OVERDUE</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="today" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {todaysTasks.length > 0 ? (
                  todaysTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass border-dashed border-white/20 rounded-[2.5rem] p-16 text-center col-span-full">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="font-bold text-2xl text-foreground">Mission Accomplished</h4>
                    <p className="text-muted-foreground mt-2">All objectives for today have been cleared.</p>
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
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass border-dashed border-white/20 rounded-[2.5rem] p-16 text-center col-span-full">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CalendarDays className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="font-bold text-2xl text-foreground">Operational Clear</h4>
                    <p className="text-muted-foreground mt-2">No upcoming tasks scheduled in the mission logs.</p>
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
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TaskCard task={task} onToggleComplete={toggleTaskComplete} onEdit={handleEdit} onDelete={deleteTask} />
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass border-dashed border-white/20 rounded-[2.5rem] p-16 text-center col-span-full">
                    <div className="h-20 w-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="h-10 w-10 text-rose-500" />
                    </div>
                    <h4 className="font-bold text-2xl text-foreground">Integrity Maintained</h4>
                    <p className="text-muted-foreground mt-2">No overdue objectives. Operational efficiency is optimal.</p>
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
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;

