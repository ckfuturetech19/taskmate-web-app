import { useState, useMemo } from 'react';
import AppLayout from '@/components/app/AppLayout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { Task } from '@/types/task';
import { Plus, CheckSquare, Sparkles } from 'lucide-react';
import { safeIsToday, safeParseDate } from '@/lib/dateUtils';
import UpgradePrompt from '@/components/premium/UpgradePrompt';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const { tasks, groups, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const personalTasks = getPersonalTasks();
  const userGroups = groups.filter(g => user && g.members.some(m => m.id === user.id));
  const groupTasks = tasks.filter(task => task.groupId && userGroups.some(g => g.id === task.groupId));

  const totalPendingCount = personalTasks.filter(t => !t.isCompleted).length;
  const totalCompletedCount = personalTasks.filter(t => t.isCompleted).length;

  const filteredTasks = useMemo(() => {
    let tasksToFilter = personalTasks; // Use personal tasks by default

    // Filter by tab
    let tabFilteredTasks: Task[];
    switch (activeTab) {
      case 'today':
        tabFilteredTasks = tasksToFilter.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = safeParseDate(task.dueDate);
          return dueDate && safeIsToday(dueDate);
        });
        break;
      case 'pending':
        tabFilteredTasks = tasksToFilter.filter(task => !task.isCompleted);
        break;
      case 'completed':
        tabFilteredTasks = tasksToFilter.filter(task => task.isCompleted);
        break;
      default:
        tabFilteredTasks = tasksToFilter;
    }

    if (activeTab === 'completed') {
      return tabFilteredTasks;
    } else if (!showCompleted) {
      return tabFilteredTasks.filter(task => !task.isCompleted);
    } else {
      return tabFilteredTasks;
    }
  }, [personalTasks, activeTab, showCompleted]);

  const handleSaveTask = (data: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
    setEditingTask(null);
    setDialogOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  return (
    <AppLayout title="Tasks">
      <div className="space-y-6 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-row items-center justify-between border-b border-[var(--border-default)] pb-4">
          <div>
            <h1 className="text-[24px] font-bold text-[var(--text-primary)]">Tasks</h1>
            <p className="text-[13px] text-[var(--text-muted)]">
              {totalPendingCount} tasks · {totalCompletedCount} completed
            </p>
          </div>
          
          <Button 
            onClick={() => {
              if (isPremium) setDialogOpen(true);
            }}
            disabled={!isPremium}
            className="rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-5 shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>

        {/* Filter Tabs & Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded-full h-10 p-1 shrink-0 flex w-full sm:w-[380px]">
              <TabsTrigger value="all" className="flex-1 rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">All</TabsTrigger>
              <TabsTrigger value="today" className="flex-1 rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Today</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Pending</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 rounded-full px-4 text-[12px] font-medium data-[state=active]:bg-[var(--brand-gradient)] data-[state=active]:text-white transition-all">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab !== 'completed' && (
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={cn(
                "px-4 h-9 rounded-full text-[12px] font-semibold border transition-all duration-150 shrink-0",
                showCompleted
                  ? "bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] border-[var(--brand-pink)]/20"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]"
              )}
            >
              {showCompleted ? 'Showing Completed' : 'Hide Completed'}
            </button>
          )}
        </div>

        {!isPremium && (
          <UpgradePrompt 
            feature="Create and Edit Tasks" 
            description="Free users can view tasks only. Upgrade to create, edit, and manage tasks."
            variant="banner"
          />
        )}

        {/* Tasks List / Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-[var(--bg-card)] rounded-[16px] border border-[var(--border-default)] p-8 max-w-lg mx-auto shadow-sm">
            {/* 72px brand-gradient circle with icon */}
            <div className="h-[72px] w-[72px] rounded-full bg-[var(--brand-gradient)] flex items-center justify-center text-white mb-5 shadow-md relative">
              <CheckSquare className="h-8 w-8" />
              <div className="absolute top-1 right-1">
                <Sparkles className="h-4 w-4 animate-pulse text-white" />
              </div>
            </div>
            
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">All clear!</h3>
            <p className="text-[14px] text-[var(--text-muted)] mt-1.5 max-w-[280px]">
              {activeTab === 'completed' 
                ? 'No completed tasks yet.'
                : activeTab === 'today'
                ? 'No tasks scheduled for today.'
                : activeTab === 'pending'
                ? 'All caught up! No pending tasks.'
                : 'Add your first task to get started'}
            </p>
            
            {activeTab !== 'completed' && isPremium && (
              <Button 
                onClick={() => setDialogOpen(true)}
                className="mt-6 rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-6"
              >
                + Add Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={isPremium ? toggleTaskComplete : undefined}
                onEdit={isPremium ? handleEdit : undefined}
                onDelete={isPremium ? deleteTask : undefined}
                readOnly={!isPremium}
              />
            ))}
          </div>
        )}
      </div>

      {isPremium && (
        <TaskDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          task={editingTask}
          onSave={handleSaveTask}
        />
      )}
    </AppLayout>
  );
};

export default Tasks;
