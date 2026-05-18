import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkspaceActions } from '@/hooks/workspace/useWorkspace';
import { Mail, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onOpenChange, workspaceId }) => {
  const { inviteMember } = useWorkspaceActions();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    inviteMember.mutate({ workspaceId, email }, {
      onSuccess: () => {
        onOpenChange(false);
        setEmail('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 rounded-xl max-w-sm p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
            <UserPlus className="w-8 h-8" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight leading-none">
            Invite <span className="text-primary">Member</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-4">
            Expand your tactical unit with elite collaborators.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Elite Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collaborator@enterprise.com" 
                className="rounded-xl bg-white/5 border-white/10 h-12 pl-12 text-sm font-bold placeholder:font-normal focus:ring-primary/20"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex sm:justify-between gap-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8">
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMember.isPending} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20 flex-1">
              {inviteMember.isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
