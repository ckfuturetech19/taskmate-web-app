import { Group } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Users, Copy, LogOut, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GroupCardProps {
  group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
  const [copied, setCopied] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const navigate = useNavigate();
  const { leaveGroup } = useTaskContext();
  const { user } = useAuth();

  const handleCopyInvite = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const code = group.inviteCode || group.code || '';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Invite code copied',
      description: 'Share this code with others to invite them.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(group.id);
      toast({
        title: 'Left group',
        description: `You have left "${group.name}".`,
      });
      setShowLeaveDialog(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to leave group',
        variant: 'destructive',
      });
    }
  };

  const isOwner = user?.id === group.ownerId;
  const initial = group.name ? group.name[0].toUpperCase() : 'G';
  const inviteCodeStr = group.inviteCode || group.code || '';

  return (
    <>
      <Card 
        className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 cursor-pointer"
        onClick={() => navigate(`/groups/${group.id}`)}
      >
        <CardContent className="p-5 flex flex-col gap-4">
          
          {/* 48px Group initials avatar */}
          <div className="h-12 w-12 rounded-full shrink-0 flex items-center justify-center text-lg font-bold text-white bg-[var(--brand-gradient)]">
            {initial}
          </div>

          {/* Group details */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[16px] text-[var(--text-primary)] leading-tight">{group.name}</h3>
            <p className="text-[13px] text-[var(--text-muted)] flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {(group.members?.length || 0)} member{(group.members?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Role + Invite Code row */}
          <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-3">
            {isOwner ? (
              <Badge className="bg-[var(--brand-gradient)] text-white font-semibold text-[11px] rounded-full px-2.5 py-0.5 border-transparent">
                Owner
              </Badge>
            ) : (
              <Badge className="bg-[#00C9A7] text-white font-semibold text-[11px] rounded-full px-2.5 py-0.5 border-transparent">
                Member
              </Badge>
            )}

            <button 
              onClick={handleCopyInvite}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-base)] text-[12px] text-[var(--text-secondary)] font-mono hover:text-[var(--text-primary)] transition-all"
            >
              <span>{inviteCodeStr}</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>

          {/* Open button & Leave action */}
          <div className="flex gap-2 w-full pt-1">
            <Button
              variant="ghost"
              className="flex-1 rounded-full h-9 bg-[var(--bg-base)] border border-[var(--border-default)] hover:bg-[var(--bg-card-hover)] text-[13px] font-semibold text-[var(--brand-purple)] gap-1.5"
            >
              Open Group
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>

            {!isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLeaveDialog(true);
                }}
                className="h-9 w-9 rounded-full border border-[var(--border-default)] text-[var(--status-danger)] hover:bg-red-500/10 hover:text-[var(--status-danger)] shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>

        </CardContent>
      </Card>

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
    </>
  );
};

export default GroupCard;
