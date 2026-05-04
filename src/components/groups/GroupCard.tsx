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
import { Users, Copy, CheckCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';

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
    await navigator.clipboard.writeText(group.inviteCode || group.code || '');
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

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => navigate(`/groups/${group.id}`)}>
        <CardContent className="p-3 sm:p-4 md:p-5">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm sm:text-base md:text-lg mb-1 break-words">{group.name}</h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>{(group.members?.length || 0)} member{(group.members?.length || 0) !== 1 ? 's' : ''}</span>
                  {isOwner && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded">Owner</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 sm:gap-2 shrink-0 text-xs sm:text-sm"
                  onClick={(e) => handleCopyInvite(e)}
                >
                  {copied ? <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  <span className="font-mono text-[10px] sm:text-xs truncate">{group.inviteCode || group.code || ''}</span>
                </Button>
                {!isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLeaveDialog(true);
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Leave</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
};

export default GroupCard;
