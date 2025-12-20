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
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm sm:text-base">Group Name</Label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="text-sm sm:text-base"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto text-sm sm:text-base">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()} className="w-full sm:w-auto text-sm sm:text-base">
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
