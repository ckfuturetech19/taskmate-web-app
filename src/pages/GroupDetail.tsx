import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDialog from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task, PriorityLevel, RecurrenceType, SubTask } from '@/types/task';
import { Plus, ArrowLeft, Copy, Users, CheckCircle, LogOut, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, addTask, updateTask, deleteTask, toggleTaskComplete, getGroupTasks, leaveGroup } = useTaskContext();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const group = groups.find(g => g.id === groupId);
  const groupTasks = groupId ? getGroupTasks(groupId) : [];
  const isOwner = user && group && user.id === group.ownerId;

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
    await navigator.clipboard.writeText(group.inviteCode || group.code || '');
    setCopied(true);
    toast({
      title: 'Invite code copied',
      description: 'Share this code with others to invite them.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    try {
      await leaveGroup(groupId);
      toast({
        title: 'Left group',
        description: `You have left "${group?.name}".`,
      });
      setShowLeaveDialog(false);
      navigate('/groups');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to leave group',
        variant: 'destructive',
      });
    }
  };

  const handleSaveTask = (data: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
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
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/groups')} className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{group.name}</h2>
            {group.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{group.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{(group.members?.length || 0)} member{(group.members?.length || 0) !== 1 ? 's' : ''}</span>
              </div>
              {isOwner && (
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                  Owner
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 sm:h-7 gap-1.5 text-xs shrink-0"
                onClick={handleCopyInvite}
              >
                {copied ? <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                <span className="font-mono text-[10px] sm:text-xs">{group.inviteCode || group.code || ''}</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs sm:text-sm text-destructive border-destructive/20 hover:bg-destructive/10"
                onClick={() => setShowLeaveDialog(true)}
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Leave</span>
              </Button>
            )}
            <Button onClick={() => setDialogOpen(true)} className="gap-2 w-full sm:w-auto text-sm sm:text-base">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
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

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave "{group.name}"? You will lose access to all group tasks and will need to be re-invited to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GroupDetail;
