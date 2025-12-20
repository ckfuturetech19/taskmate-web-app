import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Join a Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode" className="text-sm sm:text-base">Invite Code</Label>
            <Input
              id="inviteCode"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="font-mono uppercase text-sm sm:text-base"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            {error && <p className="text-xs sm:text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto text-sm sm:text-base">
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={code.length < 6} className="w-full sm:w-auto text-sm sm:text-base">
            Join Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupDialog;
