import { useState, useMemo, useRef } from 'react';
import AppLayout from '@/components/app/AppLayout';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import RemindersCard from '@/components/dashboard/RemindersCard';
import TaskListCard from '@/components/dashboard/TaskListCard';
import TimeTrackerCard from '@/components/dashboard/TimeTrackerCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types/task';
import { CalendarDays, Clock, CheckCircle2, Plus, TrendingUp, AlertCircle, FileDown, Upload, CheckCircle, XCircle } from 'lucide-react';
import { safeIsToday, safeParseDate, safeIsPast } from '@/lib/dateUtils';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveTask = (data: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
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

  const handleImportClick = () => {
    setImportDialogOpen(true);
    setImportResult(null);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      let data: any;

      // Try to parse as JSON
      try {
        data = JSON.parse(text);
      } catch (e) {
        toast({
          title: 'Invalid file format',
          description: 'Please upload a valid JSON file.',
          variant: 'destructive',
        });
        setImporting(false);
        return;
      }

      // Handle array of tasks or single task object
      const tasksToImport = Array.isArray(data) ? data : [data];
      let successCount = 0;
      let failedCount = 0;

      // Import each task
      for (const taskData of tasksToImport) {
        try {
          // Validate required fields
          if (!taskData.title || typeof taskData.title !== 'string') {
            failedCount++;
            continue;
          }

          // Prepare task data (exclude id, createdAt, userId, completed)
          const taskToAdd: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'> = {
            title: taskData.title,
            description: taskData.description || undefined,
            dueDate: taskData.dueDate || undefined,
            reminder: taskData.reminder || undefined,
            reminderUtc: taskData.reminderUtc || undefined,
            priorityLevel: taskData.priorityLevel || 'none',
            categoryId: taskData.categoryId || undefined,
            tags: taskData.tags || undefined,
            subtasks: taskData.subtasks || undefined,
            recurrenceType: taskData.recurrenceType || 'none',
            recurrenceFrequency: taskData.recurrenceFrequency || undefined,
            recurrence: taskData.recurrence || undefined,
            timeWindowStart: taskData.timeWindowStart || undefined,
            timeWindowEnd: taskData.timeWindowEnd || undefined,
            focusTimerEnabled: taskData.focusTimerEnabled || false,
            focusDurationMinutes: taskData.focusDurationMinutes || undefined,
            color: taskData.color || undefined,
            colorIndex: taskData.colorIndex || undefined,
          };

          await addTask(taskToAdd);
          successCount++;
        } catch (error) {
          console.error('Error importing task:', error);
          failedCount++;
        }
      }

      setImportResult({ success: successCount, failed: failedCount });
      
      if (successCount > 0) {
        toast({
          title: 'Import successful',
          description: `Successfully imported ${successCount} task${successCount !== 1 ? 's' : ''}${failedCount > 0 ? `, ${failedCount} failed` : ''}.`,
        });
      } else {
        toast({
          title: 'Import failed',
          description: 'No tasks were imported. Please check your file format.',
          variant: 'destructive',
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: 'Import error',
        description: 'Failed to read the file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-3 sm:space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Plan, prioritize, and accomplish your tasks with ease.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button 
              onClick={() => setDialogOpen(true)} 
              size="default"
              className="gap-2 transition-all duration-300 hover:scale-105 group text-sm"
              style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button 
              variant="outline"
              size="default"
              className="gap-2 transition-all duration-300 hover:scale-105 text-sm"
              onClick={handleImportClick}
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Import Data</span>
              <span className="sm:hidden">Import</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Today's Tasks"
            value={todaysTasks.length}
            icon={CalendarDays}
            trend="up"
            trendValue={5}
            trendText="Increased from last month"
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Pending"
            value={pendingTasks.length}
            icon={Clock}
            subtitle={`${pendingTasks.length} tasks remaining`}
            delay={100}
          />
          <StatCard
            title="Completed Today"
            value={completedToday.length}
            icon={CheckCircle2}
            trend="up"
            subtitle={`${completedToday.length} tasks done`}
            delay={200}
          />
          <StatCard
            title="Overdue"
            value={overdueTasks.length}
            icon={AlertCircle}
            variant={overdueTasks.length > 0 ? 'destructive' : undefined}
            subtitle={overdueTasks.length > 0 ? "Needs attention" : "All on track"}
            delay={300}
          />
        </div>

        {/* Middle Section - Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          {/* Project Analytics */}
          <div className="animate-slide-in-up flex" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
            <AnalyticsChart
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
                    completed: dayTasks.filter(t => t.completed).length,
                    pending: dayTasks.filter(t => !t.completed).length,
                    value: dayTasks.length,
                  };
                });
              }, [personalTasks])}
              type="bar"
              title="Project Analytics"
              className="w-full h-full flex flex-col"
            />
          </div>

          {/* Focus Timers */}
          <div className="animate-slide-in-up flex" style={{ animationDelay: '450ms', animationFillMode: 'both' }}>
            <div className="w-full h-full flex flex-col">
              <RemindersCard
                tasks={personalTasks}
                onAddTask={() => setDialogOpen(true)}
                onStartTimer={(task) => {
                  // Navigate to clock or start timer
                  console.log('Start timer for task:', task);
                }}
                className="h-full flex flex-col"
              />
            </div>
          </div>

          {/* Time Tracker */}
          <div className="animate-slide-in-up flex" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
            <TimeTrackerCard className="w-full h-full" />
          </div>
        </div>

        {/* Task Sections with Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9">
            <TabsTrigger value="today" className="gap-1.5 text-xs sm:text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Today</span>
              <span className="sm:hidden">Today</span>
              <span className="hidden md:inline"> ({todaysTasks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-1.5 text-xs sm:text-sm">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Overdue</span>
              <span className="sm:hidden">Overdue</span>
              <span className="hidden md:inline"> ({overdueTasks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5 text-xs sm:text-sm">
              <Clock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Upcoming</span>
              <span className="hidden md:inline"> ({upcomingTasks.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Today's Tasks */}
          <TabsContent value="today" className="mt-3">
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
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {todaysTasks.slice(0, 5).map((task, index) => (
                  <div 
                    key={task.id}
                    className="animate-slide-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                    />
                  </div>
                ))}
                {todaysTasks.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{todaysTasks.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          {/* Overdue Tasks */}
          <TabsContent value="overdue" className="mt-3">
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
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {overdueTasks.slice(0, 5).map((task, index) => (
                  <div 
                    key={task.id}
                    className="animate-slide-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                    />
                  </div>
                ))}
                {overdueTasks.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{overdueTasks.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          {/* Upcoming Tasks */}
          <TabsContent value="upcoming" className="mt-3">
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
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {upcomingTasks.slice(0, 5).map((task, index) => (
                  <div 
                    key={task.id}
                    className="animate-slide-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                    />
                  </div>
                ))}
                {upcomingTasks.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{upcomingTasks.length - 5} more tasks
                  </p>
                )}
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

      {/* Import Data Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle>Import Tasks</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              Upload a JSON file to import tasks. The file should contain an array of task objects or a single task object.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Select a JSON file</p>
              <p className="text-xs text-muted-foreground mb-4">
                Choose a file containing your tasks
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
                id="import-file-input"
                disabled={importing}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                variant="outline"
                className="gap-2"
                style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)' }}
              >
                <Upload className="h-4 w-4" />
                {importing ? 'Importing...' : 'Choose File'}
              </Button>
            </div>

            {importResult && (
              <div className="p-4 rounded-lg border" style={{ 
                backgroundColor: importResult.failed > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderColor: importResult.failed > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'
              }}>
                <div className="flex items-start gap-3">
                  {importResult.failed === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">
                      {importResult.failed === 0 ? 'Import Complete' : 'Import Completed with Errors'}
                    </p>
                    <div className="text-xs space-y-1">
                      <p className="text-green-600 dark:text-green-400">
                        ✓ {importResult.success} task{importResult.success !== 1 ? 's' : ''} imported successfully
                      </p>
                      {importResult.failed > 0 && (
                        <p className="text-red-600 dark:text-red-400">
                          ✗ {importResult.failed} task{importResult.failed !== 1 ? 's' : ''} failed to import
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-semibold mb-2">Expected JSON format:</p>
              <pre className="text-xs text-muted-foreground overflow-x-auto">
{`[
  {
    "title": "Task title",
    "description": "Optional description",
    "dueDate": "2024-01-01T00:00:00.000Z",
    "priorityLevel": "high"
  }
]`}
              </pre>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setImportResult(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={importing}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Dashboard;
