import React from 'react';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Building2, User, CheckCircle2, LayoutGrid, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CreateWorkspaceModal } from '@/components/workspace/CreateWorkspaceModal';
import logoImg from '../../assets/logo.png';

export const WorkspaceSwitcher: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  const handleSwitch = async (ws: any) => {
    await setCurrentWorkspace(ws);
    const type = ws.type || ws.workspaceType;
    if (type === 'COMPANY') {
      navigate('/workspace/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={cn("px-3 py-3 mb-1", collapsed && "px-1.5 py-2")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full flex items-center justify-between group transition-all duration-300 rounded-xl hover:bg-white/5",
              collapsed ? "px-2 py-6 h-12" : "px-3 py-6 h-14 border border-white/5 bg-white/5 shadow-xl"
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={logoImg} alt="Logo" className={cn(
                  "relative z-10 transition-transform duration-500 group-hover:rotate-12",
                  collapsed ? "h-8 w-8" : "h-10 w-10"
                )} />
              </div>
              
              {!collapsed && (
                <div className="flex flex-col items-start overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-lg tracking-tighter text-foreground leading-none">
                      TASK<span className="text-primary">MATE</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 max-w-full">
                  <div className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      (currentWorkspace?.type === 'PERSONAL' || currentWorkspace?.workspaceType === 'PERSONAL') ? "bg-blue-400" : "bg-purple-400"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
                      {currentWorkspace?.name || 'No Workspace Selected'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-2 glass border-white/10 rounded-xl shadow-2xl" align="start" sideOffset={8}>
          <div className="px-3 py-2 mb-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Select Workspace</p>
          </div>
          
          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleSwitch(ws)}
                className={cn(
                  "flex items-center justify-between p-2.5 cursor-pointer rounded-xl transition-all duration-200",
                  currentWorkspace?.id === ws.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg",
                    (ws.type === 'PERSONAL' || ws.workspaceType === 'PERSONAL') 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-br from-purple-500 to-pink-600"
                  )}>
                    {ws.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold truncate max-w-[140px]">
                      {ws.name}
                    </span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                      {(ws.type === 'PERSONAL' || ws.workspaceType === 'PERSONAL') ? 'Personal Account' : 'Company Workspace'}
                    </span>
                  </div>
                </div>
                {currentWorkspace?.id === ws.id ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-primary/30 transition-colors" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
          
          <DropdownMenuSeparator className="my-3 bg-white/5" />
          
          <DropdownMenuItem 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl text-primary hover:bg-primary/10 focus:bg-primary/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">Create Workspace</span>
              <span className="text-[9px] font-medium text-primary/60 uppercase tracking-wider">Collaborate with teams</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-3 bg-white/5" />

          <div className="px-3 py-2 flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{user?.name || 'User'}</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Premium Account</span>
            </div>
          </div>

          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
};

