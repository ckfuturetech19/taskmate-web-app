import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTasks } from '@/hooks/workspace/useTasks';
import { useProjects, useProjectMembers } from '@/hooks/workspace/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Calendar, User, Tag, Layout } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProjectId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onOpenChange, initialProjectId }) => {
  const { createTask } = useTasks();
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || '');
  const { data: projectMembers } = useProjectMembers(selectedProjectId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: initialProjectId || '',
    assignedTo: '',
    priority: 'MEDIUM',
    dueDate: ''
  });

  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
      setFormData(prev => ({ ...prev, projectId: initialProjectId }));
    }
  }, [initialProjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean data to match API requirements
    const payload = {
      ...formData,
      assignedTo: formData.assignedTo || undefined, // Send undefined if empty
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
    };

    createTask.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          title: '',
          description: '',
          projectId: initialProjectId || '',
          assignedTo: '',
          priority: 'MEDIUM',
          dueDate: ''
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 rounded-[2.5rem] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            Create Team Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Task Title</Label>
            <Input 
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Design system refactor..." 
              className="rounded-xl bg-white/5 border-white/10 h-12 text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(val) => {
                  setFormData(prev => ({ ...prev, projectId: val, assigneeId: '' }));
                  setSelectedProjectId(val);
                }}
              >
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10 rounded-xl">
                  {projects?.map((p: any) => (
                    <SelectItem key={p.id} value={p.id} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Assignee</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, assignedTo: val }))}
                disabled={!formData.projectId}
              >
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                  <SelectValue placeholder={!formData.projectId ? "Select project first" : "Select member"} />
                </SelectTrigger>
                <SelectContent className="glass border-white/10 rounded-xl">
                  {projectMembers?.map((m: any) => (
                    <SelectItem key={m.userId} value={m.userId} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5 rounded-md">
                          <AvatarImage src={m.user?.avatarUrl} />
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{m.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        {m.user?.name}
                      </div>
                    </SelectItem>
                  ))}
                  {projectMembers?.length === 0 && (
                    <div className="p-4 text-center text-[10px] text-muted-foreground uppercase font-black">No members in this project</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, priority: val }))}
              >
                <SelectTrigger className="rounded-xl bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-white/10 rounded-xl">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Due Date</Label>
              <Input 
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="rounded-xl bg-white/5 border-white/10 h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What needs to be done?" 
              className="rounded-xl bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button type="submit" disabled={createTask.isPending} className="rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              {createTask.isPending ? 'Creating...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
