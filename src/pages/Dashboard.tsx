import { useState } from 'react';
import AppLayout from '@/components/app/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task, Priority, RecurringType, SubTask } from '@/types/task';
import { CalendarDays, Clock, CheckCircle2, Plus, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { safeIsToday, safeParseDate, safeIsPast } from '@/lib/dateUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const personalTasks = getPersonalTasks();
  
  const todaysTasks = personalTasks.filter(task => {
    if (task.completed || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && safeIsToday(dueDate);
  });
  
  const overdueTasks = personalTasks.filter(task => {
    if (task.completed || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate);
  });
  
  const upcomingTasks = personalTasks.filter(task => {
    if (task.completed || !task.dueDate) return false;
    const dueDate = safeParseDate(task.dueDate);
    return dueDate && !safeIsPast(dueDate) && !safeIsToday(dueDate);
  }).slice(0, 5);
  
  const pendingTasks = personalTasks.filter(task => !task.completed);
  
  const completedToday = personalTasks.filter(task => {
    if (!task.completed || !task.lastCompletedDate) return false;
    const completedDate = safeParseDate(task.lastCompletedDate);
    return completedDate && safeIsToday(completedDate);
  });
  
  const completionRate = pendingTasks.length > 0 
    ? Math.round((completedToday.length / (completedToday.length + pendingTasks.length)) * 100)
    : 100;

  const handleSaveTask = (data: {
    title: string;
    description?: string;
    dueDate?: string;
    recurring: RecurringType;
    priority: Priority;
    groupId?: string;
    groupMembers?: string[];
    color?: string;
    colorIndex?: number;
    categoryId?: string;
    tags?: string[];
    subtasks?: SubTask[];
    reminder?: string;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 sm:p-8 border border-primary/20">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                You have {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''} today
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2 w-full sm:w-auto shrink-0 shadow-lg">
              <Plus className="h-5 w-5" />
              <span>New Task</span>
            </Button>
          </div>
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Tasks"
            value={todaysTasks.length}
            icon={CalendarDays}
            trend={completionRate > 50 ? 'up' : undefined}
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Pending"
            value={pendingTasks.length}
            icon={Clock}
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Completed Today"
            value={completedToday.length}
            icon={CheckCircle2}
            trend="up"
            className="hover:shadow-lg transition-shadow"
          />
          <StatCard
            title="Overdue"
            value={overdueTasks.length}
            icon={AlertCircle}
            variant={overdueTasks.length > 0 ? 'destructive' : undefined}
            className="hover:shadow-lg transition-shadow"
          />
        </div>

        {/* Quick Stats Card */}
        {completedToday.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold text-foreground">{completionRate}% Complete</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedToday.length} of {completedToday.length + pendingTasks.length} tasks completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Sections with Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Today ({todaysTasks.length})
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Overdue ({overdueTasks.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-2">
              <Clock className="h-4 w-4" />
              Upcoming ({upcomingTasks.length})
            </TabsTrigger>
          </TabsList>

          {/* Today's Tasks */}
          <TabsContent value="today" className="mt-6">
            {todaysTasks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CalendarDays className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No tasks for today</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start your day by adding a new task</p>
                  <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todaysTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Overdue Tasks */}
          <TabsContent value="overdue" className="mt-6">
            {overdueTasks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">You have no overdue tasks</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {overdueTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Tasks */}
          <TabsContent value="upcoming" className="mt-6">
            {upcomingTasks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming tasks</h3>
                  <p className="text-sm text-muted-foreground mb-4">Plan ahead by scheduling tasks</p>
                  <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </AppLayout>
  );
};

export default Dashboard;
