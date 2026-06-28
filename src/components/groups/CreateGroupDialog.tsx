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

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (name: string) => void;
}

const CreateGroupDialog = ({ open, onOpenChange, onCreateGroup }: CreateGroupDialogProps) => {
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateGroup(name.trim());
    setName('');
    onOpenChange(false);
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
          <DialogTitle className="text-[20px] font-semibold text-[var(--text-primary)]">Create New Group</DialogTitle>
          <DialogDescription className="text-[14px] text-[var(--text-muted)] mt-1">
            Create a collaborative group to coordinate tasks with your team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="groupName" className="text-[13px] font-semibold text-[var(--text-secondary)]">Group Name</Label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Team"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="h-11 border-[var(--border-strong)] focus:border-[var(--brand-pink)] rounded-[12px] bg-transparent text-[14px]"
              autoFocus
            />
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
            onClick={handleCreate} 
            disabled={!name.trim()} 
            className="rounded-full h-10 bg-[var(--brand-gradient)] text-white hover:brightness-105 shadow-sm text-[13px] font-semibold px-6 min-w-[120px]"
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
