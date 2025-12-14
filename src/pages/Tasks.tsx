import { useState, useMemo } from 'react';
import AppLayout from '@/components/app/AppLayout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task, Priority, RecurringType, SubTask } from '@/types/task';
import { Plus, CheckSquare, Users } from 'lucide-react';
import { safeIsToday, safeParseDate } from '@/lib/dateUtils';

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, groups, addTask, updateTask, deleteTask, toggleTaskComplete, getPersonalTasks } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const personalTasks = getPersonalTasks();
  const userGroups = groups.filter(g => user && g.members[user.uid] === true);
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
    switch (activeTab) {
      case 'today':
        return tasksToFilter.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = safeParseDate(task.dueDate);
          return dueDate && safeIsToday(dueDate);
        });
      case 'pending':
        return tasksToFilter.filter(task => !task.completed);
      case 'completed':
        return tasksToFilter.filter(task => task.completed);
      default:
        return tasksToFilter;
    }
  }, [tasks, personalTasks, groupTasks, activeTab, selectedGroup]);

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
    <AppLayout title="Tasks">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="w-full overflow-x-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">All</TabsTrigger>
                <TabsTrigger value="today" className="text-xs sm:text-sm px-2 py-2">Today</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 py-2">Pending</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 py-2">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
            
          <div className="flex items-center gap-3">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full sm:w-[220px]">
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
            
            <Button 
              onClick={() => setDialogOpen(true)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>

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
            {activeTab !== 'completed' && (
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
                onToggleComplete={toggleTaskComplete}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
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

export default Tasks;
