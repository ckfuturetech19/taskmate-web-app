import { useState, useMemo } from 'react';
import AppLayout from '@/components/app/AppLayout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import GroupCard from '@/components/groups/GroupCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { Task, PriorityLevel, RecurrenceType, SubTask } from '@/types/task';
import { Plus, CheckSquare, Users } from 'lucide-react';
import { safeIsToday, safeParseDate } from '@/lib/dateUtils';
import { useNavigate } from 'react-router-dom';
import UpgradePrompt from '@/components/premium/UpgradePrompt';

const Tasks = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const { tasks, groups, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  const personalTasks = getPersonalTasks();
  const userGroups = groups.filter(g => user && g.members.some(m => m.id === user.id));
  const groupTasks = tasks.filter(task => task.groupId && userGroups.some(g => g.id === task.groupId));

  console.log('=== Tasks Page Rendering ===');
  console.log('All tasks:', tasks.length);
  console.log('Personal tasks:', personalTasks.length);
  console.log('Group tasks:', groupTasks.length);
  console.log('User groups:', userGroups.length);

  const filteredTasks = useMemo(() => {
    let tasksToFilter = tasks; // Start with ALL tasks (both personal and group)

    // Filter by group first
    if (selectedGroup === 'group-tasks') {
      tasksToFilter = groupTasks;
    } else if (selectedGroup !== 'all' && selectedGroup !== 'personal') {
      tasksToFilter = groupTasks.filter(task => task.groupId === selectedGroup);
    } else if (selectedGroup === 'personal') {
      tasksToFilter = personalTasks.filter(task => !task.groupId);
    }
    // If selectedGroup is 'all', use all tasks (no filtering needed)

    // Then filter by tab
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

    // Filter by completion status - by default, only show non-completed tasks
    // But if activeTab is 'completed', always show completed tasks
    // And if showCompleted is true, show all tasks
    if (activeTab === 'completed') {
      return tabFilteredTasks; // Always show completed tasks in completed tab
    } else if (!showCompleted) {
      return tabFilteredTasks.filter(task => !task.isCompleted);
    } else {
      return tabFilteredTasks; // Show all tasks if showCompleted is true
    }
  }, [tasks, personalTasks, groupTasks, activeTab, selectedGroup, showCompleted]);

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

  return (
    <AppLayout title="Tasks">
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          <div className="w-full overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="all" className="text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-2 py-1.5 sm:py-2">All</TabsTrigger>
                <TabsTrigger value="today" className="text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-2 py-1.5 sm:py-2">Today</TabsTrigger>
                <TabsTrigger value="pending" className="text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-2 py-1.5 sm:py-2">Pending</TabsTrigger>
                <TabsTrigger value="completed" className="text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-2 py-1.5 sm:py-2">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
            
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full sm:w-[200px] md:w-[220px] text-sm">
                <SelectValue placeholder="All Tasks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="personal">Personal Only</SelectItem>
                {userGroups.length > 0 && (
                  <>
                    <SelectItem value="group-tasks">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        All Group Tasks
                      </div>
                    </SelectItem>
                    {userGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {group.name}
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>

            <Select value={showCompleted ? 'show' : 'hide'} onValueChange={(v) => setShowCompleted(v === 'show')}>
              <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] text-sm">
                <SelectValue placeholder="Show Completed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hide">Hide Completed</SelectItem>
                <SelectItem value="show">Show Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => {
                if (!isPremium) {
                  // Show upgrade prompt
                  return;
                }
                setDialogOpen(true);
              }}
              disabled={!isPremium}
              className="shrink-0 w-full sm:w-auto text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {!isPremium && (
          <UpgradePrompt 
            feature="Create and Edit Tasks" 
            description="Free users can view tasks only. Upgrade to create, edit, and manage tasks."
            variant="banner"
          />
        )}

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {activeTab === 'completed' 
                ? 'No completed tasks yet.'
                : activeTab === 'today'
                ? 'No tasks scheduled for today.'
                : activeTab === 'pending'
                ? 'All caught up! No pending tasks.'
                : 'No tasks yet. Create your first one!'}
            </p>
            {activeTab !== 'completed' && isPremium && (
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setDialogOpen(true)}
              >
                Add a task
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

        {/* Groups Section */}
        {userGroups.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Groups
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/groups')}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGroups.slice(0, 6).map(group => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
            {userGroups.length > 6 && (
              <div className="text-center pt-2">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/groups')}
                >
                  View all {userGroups.length} groups
                </Button>
              </div>
            )}
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
