import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/hooks/workspace/useProjects';
import { useWorkspaceMembers } from '@/hooks/workspace/useWorkspace';
import { Folder, Palette, Users } from 'lucide-react';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onOpenChange }) => {
  const { createProject } = useProjects();
  const { members } = useWorkspaceMembers();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    memberIds: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ name: '', description: '', color: '#3B82F6', memberIds: [] });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 rounded-[2.5rem] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Folder className="w-6 h-6 text-primary" />
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Name</Label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Strategic Initiative Alpha" 
              className="rounded-xl bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project goals and objectives..." 
              className="rounded-xl bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Color</Label>
            <div className="flex gap-2">
              {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Initial Team</Label>
            <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
              {members?.map((m: any) => (
                <label key={m.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <input 
                    type="checkbox"
                    checked={formData.memberIds.includes(m.userId)}
                    onChange={(e) => {
                      const newIds = e.target.checked 
                        ? [...formData.memberIds, m.userId]
                        : formData.memberIds.filter(id => id !== m.userId);
                      setFormData(prev => ({ ...prev, memberIds: newIds }));
                    }}
                    className="w-4 h-4 rounded border-white/10 text-primary focus:ring-primary bg-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                      {m.user?.name?.[0]}
                    </div>
                    <span className="text-xs font-bold">{m.user?.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button type="submit" disabled={createProject.isPending} className="rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              {createProject.isPending ? 'Creating...' : 'Launch Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
