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
import { Task } from '@/types/task';
import { Plus, ArrowLeft, Copy, Users, CheckCircle, LogOut } from 'lucide-react';
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
        <div className="text-center py-16 bg-[var(--bg-card)] rounded-[16px] border border-[var(--border-default)] p-8 max-w-md mx-auto shadow-sm">
          <p className="text-[14px] text-[var(--text-muted)] mb-4">This group doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/groups')} className="rounded-full bg-[var(--brand-gradient)] text-white">Back to Groups</Button>
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
    setDialogOpen(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  return (
    <AppLayout title={group.name}>
      <div className="space-y-6 pb-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/groups')} 
              className="h-9 w-9 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-default)] shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[24px] font-bold text-[var(--text-primary)] leading-tight">{group.name}</h1>
                {isOwner ? (
                  <Badge className="bg-[var(--brand-gradient)] text-white font-semibold text-[11px] rounded-full px-2 py-0.5 border-transparent">
                    Owner
                  </Badge>
                ) : (
                  <Badge className="bg-[#00C9A7] text-white font-semibold text-[11px] rounded-full px-2 py-0.5 border-transparent">
                    Member
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-[13px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-[var(--text-muted)]" />
                  {(group.members?.length || 0)} member{(group.members?.length || 0) !== 1 ? 's' : ''}
                </span>

                <button 
                  onClick={handleCopyInvite}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] text-[11px] text-[var(--text-secondary)] font-mono hover:text-[var(--text-primary)] transition-all"
                >
                  <span>{group.inviteCode || group.code || ''}</span>
                  {copied ? <CheckCircle className="h-3 w-3 text-[var(--status-success)]" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLeaveDialog(true)}
                className="h-9 px-3.5 rounded-full border border-[var(--status-danger)] hover:bg-red-500/10 text-[var(--status-danger)] text-[13px] font-semibold gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Leave Group
              </Button>
            )}
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-5 shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Task
            </Button>
          </div>
        </div>

        {group.description && (
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mt-2 max-w-2xl bg-[var(--bg-card)] p-4 rounded-[12px] border border-[var(--border-default)]">
            {group.description}
          </p>
        )}

        {/* Tasks list / Empty state */}
        {groupTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-[var(--bg-card)] rounded-[16px] border border-[var(--border-default)] p-8 max-w-lg mx-auto shadow-sm">
            <div className="h-[72px] w-[72px] rounded-full bg-[var(--brand-gradient)] flex items-center justify-center text-white mb-5 shadow-md">
              <Users className="h-8 w-8" />
            </div>
            
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">No tasks yet</h3>
            <p className="text-[14px] text-[var(--text-muted)] mt-1.5 max-w-[280px]">
              Add the first task to kick things off
            </p>

            <Button 
              onClick={() => setDialogOpen(true)}
              className="mt-6 rounded-full bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold h-9 px-6"
            >
              + Add Task
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
        <AlertDialogContent className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-default)] shadow-[var(--shadow-modal)] p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold text-[18px] text-[var(--text-primary)]">Leave Group?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-[var(--text-secondary)]">
              Are you sure you want to leave "{group.name}"? You will lose access to all collaborative tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel onClick={() => setShowLeaveDialog(false)} className="rounded-full h-9 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup} className="rounded-full h-9 bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90 text-[13px]">
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default GroupDetail;
