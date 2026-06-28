import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, X } from 'lucide-react';
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
      <DialogContent className="max-w-[480px] rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-default)] p-8 shadow-[var(--shadow-modal)] relative">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="p-0 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[var(--brand-gradient)] flex items-center justify-center text-white">
              <KeyRound className="h-4.5 w-4.5" />
            </div>
            <DialogTitle className="text-[20px] font-semibold text-[var(--text-primary)]">Join Group Note</DialogTitle>
          </div>
          <DialogDescription className="text-[14px] text-[var(--text-muted)] mt-1">
            Enter the 8-digit invite code to join a collaborative note.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="inviteCode" className="text-[13px] font-semibold text-[var(--text-secondary)]">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="E.g. A1B2C3D4"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={8}
              className="h-11 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[16px] font-mono tracking-[0.15em] text-center uppercase"
              disabled={loading}
              autoFocus
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="rounded-full h-10 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || inviteCode.length !== 8}
              className="rounded-full h-10 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold px-6 min-w-[120px]"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Join Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinNoteDialog;
