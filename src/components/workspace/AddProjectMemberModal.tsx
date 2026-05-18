import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProjectMembers } from '@/hooks/workspace/useProjects';
import { useWorkspaceMembers } from '@/hooks/workspace/useWorkspace';
import { UserPlus, Search, User, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AddProjectMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingMemberIds: string[];
}

export const AddProjectMemberModal: React.FC<AddProjectMemberModalProps> = ({ 
  open, 
  onOpenChange, 
  projectId,
  existingMemberIds 
}) => {
  const { addMember } = useProjectMembers(projectId);
  const { members: workspaceMembers } = useWorkspaceMembers();
  const [searchTerm, setSearchTerm] = useState('');

  const availableMembers = workspaceMembers?.filter((m: any) => 
    !existingMemberIds.includes(m.userId) &&
    (m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = (userId: string) => {
    addMember.mutate(userId, {
      onSuccess: () => {
        // We don't close the modal so they can add multiple
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 rounded-[2.5rem] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Add Project Personnel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search workspace members..." 
              className="pl-10 rounded-xl bg-white/5 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {availableMembers?.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarImage src={m.user?.avatarUrl} />
                    <AvatarFallback className="text-[10px] font-black uppercase bg-primary/10 text-primary">
                      {m.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{m.user?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.user?.email}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10"
                  onClick={() => handleAdd(m.userId)}
                  disabled={addMember.isPending}
                >
                  Deploy
                </Button>
              </div>
            ))}
            {availableMembers?.length === 0 && (
              <div className="py-10 text-center text-xs text-muted-foreground italic">
                {searchTerm ? 'No matching members found.' : 'All workspace members are already assigned.'}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="rounded-xl font-bold px-8">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
