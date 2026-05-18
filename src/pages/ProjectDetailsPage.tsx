import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { useProject, useProjectMembers } from '@/hooks/workspace/useProjects';
import { useTasks } from '@/hooks/workspace/useTasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Folder, 
  Users, 
  CheckCircle2, 
  Clock, 
  Settings, 
  Plus, 
  ChevronRight,
  UserPlus,
  Trash2,
  LayoutDashboard
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { CreateTaskModal } from '@/components/workspace/CreateTaskModal';
import { AddProjectMemberModal } from '@/components/workspace/AddProjectMemberModal';

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useWorkspace();
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = React.useState(false);
  
  const { data: project, isLoading: projectLoading } = useProject(id!);
  const { data: members, isLoading: membersLoading, removeMember } = useProjectMembers(id!);
  const { data: tasks, isLoading: tasksLoading } = useTasks(id);

  if (projectLoading) return <ProjectSkeleton />;

  const completedTasks = tasks?.filter((t: any) => t.status === 'DONE').length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AppLayout title={`Project: ${project?.name || 'Loading...'}`}>
      <div className="space-y-6 pb-10">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
              <Folder className="h-3 w-3" />
              <span>Project Blueprint</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
              {project?.name}
            </h1>
            <p className="text-muted-foreground text-sm font-medium max-w-2xl italic border-l-2 border-primary/20 pl-4">
              {project?.description || 'No description provided for this project.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl glass border-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            {hasPermission('TASK_CREATE') && (
              <Button 
                onClick={() => setTaskModalOpen(true)}
                className="rounded-xl shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            )}
          </div>
        </div>

        {/* Project Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{progress}%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completion Rate</p>
            </div>
          </Card>
          <Card className="glass border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{totalTasks - completedTasks}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Tasks</p>
            </div>
          </Card>
          <Card className="glass border-white/10 rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black">{members?.length || 0}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Contributors</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <Card className="lg:col-span-2 glass rounded-xl border-white/10 overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Project Tasks</CardTitle>
                <CardDescription>Collaborative execution pipeline.</CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full px-4">{tasks?.length || 0} Total</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {tasksLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-none" />)
                ) : tasks?.length > 0 ? (
                  tasks.map((task: any) => (
                    <div 
                      key={task.id} 
                      onClick={() => navigate(`/team-tasks/${task.id}`)}
                      className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          task.status === 'DONE' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                        )}>
                          {task.status === 'DONE' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className={cn("font-bold text-sm", task.status === 'DONE' && "line-through text-muted-foreground")}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[9px] font-black uppercase px-2 h-4 border-none">
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-[10px] text-muted-foreground">
                                Due {format(new Date(task.dueDate), 'MMM dd')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center">
                    <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-bold">No tasks yet.</p>
                    <Button variant="link" className="text-primary font-black uppercase tracking-widest text-[10px]">Create the first task</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Members & Activity */}
          <div className="space-y-6">
            <Card className="glass rounded-xl border-white/10 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center justify-between">
                  Team
                  {hasPermission('MEMBER_INVITE') && (
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setAddMemberModalOpen(true)}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                {membersLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
                ) : members?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                        <AvatarImage src={m.user?.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                          {m.user?.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold">{m.user?.name}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          {typeof m.role === 'object' ? m.role.name : m.role}
                        </p>
                      </div>
                    </div>
                    {hasPermission('MEMBER_REMOVE') && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this member from the project?')) {
                            removeMember.mutate(m.user.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass rounded-xl border-white/10 overflow-hidden bg-primary/5">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Project Analytics</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  Track performance and velocity metrics for this specific initiative.
                </p>
                <Button className="w-full rounded-xl font-black uppercase tracking-widest text-[10px]">View Full Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <CreateTaskModal 
        open={taskModalOpen} 
        onOpenChange={setTaskModalOpen} 
        initialProjectId={id} 
      />
      <AddProjectMemberModal 
        open={addMemberModalOpen} 
        onOpenChange={setAddMemberModalOpen} 
        projectId={id!}
        existingMemberIds={members?.map((m: any) => m.userId) || []}
      />
    </AppLayout>
  );
};

const ProjectSkeleton = () => (
  <AppLayout title="Loading Project...">
    <div className="space-y-6">
      <Skeleton className="h-20 w-3/4 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="col-span-2 h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  </AppLayout>
);
