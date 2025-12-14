import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task, Priority, RecurringType, SubTask } from '@/types/task';
import { Plus, ArrowLeft, Copy, Users, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, addTask, updateTask, deleteTask, toggleTaskComplete, getGroupTasks } = useTaskContext();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [copied, setCopied] = useState(false);

  const group = groups.find(g => g.id === groupId);
  const groupTasks = groupId ? getGroupTasks(groupId) : [];

  if (!group) {
    return (
      <AppLayout title="Group Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">This group doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
        </div>
      </AppLayout>
    );
  }

  const handleCopyInvite = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    toast({
      title: 'Invite code copied',
      description: 'Share this code with others to invite them.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

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
      addTask({ ...data, groupId: group.id });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  return (
    <AppLayout title={group.name}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/groups')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{group.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{Object.keys(group.members || {}).length} member{Object.keys(group.members || {}).length !== 1 ? 's' : ''}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs"
                onClick={handleCopyInvite}
              >
                {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="font-mono">{group.inviteCode}</span>
              </Button>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>

        {groupTasks.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">
              No tasks in this group yet.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              Add the first task
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {groupTasks.map(task => (
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
        groupId={group.id}
        onSave={handleSaveTask}
      />
    </AppLayout>
  );
};

export default GroupDetail;
