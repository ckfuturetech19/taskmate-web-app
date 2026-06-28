import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinGroup: (inviteCode: string) => boolean;
}

const JoinGroupDialog = ({ open, onOpenChange, onJoinGroup }: JoinGroupDialogProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!code.trim()) return;
    const success = onJoinGroup(code.trim().toUpperCase());
    if (success) {
      setCode('');
      setError('');
      onOpenChange(false);
    } else {
      setError('Invalid invite code. Please check and try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setCode('');
        setError('');
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-[480px] rounded-[20px] bg-[var(--bg-card)] border border-[var(--border-default)] p-8 shadow-[var(--shadow-modal)] relative">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-[20px] font-semibold text-[var(--text-primary)]">Join a Group</DialogTitle>
          <DialogDescription className="text-[14px] text-[var(--text-muted)] mt-1">
            Enter a 6-character group invite code to join your team's workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="inviteCode" className="text-[13px] font-semibold text-[var(--text-secondary)]">Invite Code</Label>
            <Input
              id="inviteCode"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="E.g. D7E3FF"
              maxLength={6}
              className="h-11 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[16px] font-mono tracking-[0.15em] text-center uppercase"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              autoFocus
            />
            {error && <p className="text-[12px] text-[var(--status-danger)] font-medium mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3 pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="rounded-full h-10 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleJoin} 
            disabled={code.length < 6} 
            className="rounded-full h-10 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold px-6 min-w-[120px]"
          >
            Join Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupDialog;
