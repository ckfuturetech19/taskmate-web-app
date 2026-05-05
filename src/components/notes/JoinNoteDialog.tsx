import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NoteService } from '@/services/noteService';
import { useNavigate } from 'react-router-dom';

interface JoinNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const JoinNoteDialog = ({ open, onOpenChange, onSuccess }: JoinNoteDialogProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: 8-digit alphanumeric
    const codeRegex = /^[A-Z0-9]{8}$/;
    if (!codeRegex.test(inviteCode.toUpperCase())) {
      toast({
        title: 'Invalid Code',
        description: 'Invite code must be 8 alphanumeric characters (A-Z, 0-9).',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await NoteService.joinNote(inviteCode.toUpperCase());
      toast({
        title: 'Success!',
        description: `You have joined "${response.data.title}"`,
      });
      onOpenChange(false);
      setInviteCode('');
      if (onSuccess) onSuccess();
      navigate(`/notes/${response.data.id}`);
    } catch (error: any) {
      console.error('Error joining note:', error);
      toast({
        title: 'Failed to Join',
        description: error.response?.data?.error || 'Check the code and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <DialogTitle>Join Group Note</DialogTitle>
          </div>
          <DialogDescription>
            Enter the 8-digit invite code to join a collaborative note.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="e.g. A1B2C3D4"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="text-center font-mono text-lg tracking-widest uppercase"
              disabled={loading}
              autoFocus
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || inviteCode.length !== 8}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Join Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinNoteDialog;
