import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceActions } from '@/hooks/workspace/useWorkspace';
import { Building2, Rocket, Shield } from 'lucide-react';

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({ open, onOpenChange }) => {
  const { createWorkspace } = useWorkspaceActions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspaceType: 'COMPANY'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkspace.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ name: '', description: '', workspaceType: 'COMPANY' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/10 rounded-xl max-w-md p-8 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight leading-none">
            Register Your <span className="text-primary">Workspace</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-4">
            Initialize a secure, collaborative environment for your team's tactical execution.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Organization Name</Label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Acme Corporation" 
              className="rounded-xl bg-white/5 border-white/10 h-12 text-lg font-bold placeholder:font-normal focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Mission Statement / Description</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Briefly define the purpose of this workspace..." 
              className="rounded-xl bg-white/5 border-white/10 min-h-[100px] font-medium resize-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">Enterprise Security</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1 leading-relaxed">
                Workspaces are isolated environments. You will be automatically assigned as the <b>OWNER</b> with full administrative control.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-4 flex sm:justify-between gap-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8">
              Cancel
            </Button>
            <Button type="submit" disabled={createWorkspace.isPending} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-primary/20 flex-1">
              {createWorkspace.isPending ? 'Initialising...' : 'Deploy Workspace'}
              {!createWorkspace.isPending && <Rocket className="w-4 h-4 ml-2" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
