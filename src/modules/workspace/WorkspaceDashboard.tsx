import React, { useState } from 'react';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import StatCard from '@/components/dashboard/StatCard';
import { useWorkspaceStats } from '@/hooks/workspace/useWorkspace';
import { useProjects } from '@/hooks/workspace/useProjects';
import { useTasks } from '@/hooks/workspace/useTasks';
import { 
  Zap, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Folder, 
  Users as UsersIcon, 
  BarChart3, 
  ArrowRight,
  Plus,
  Rocket,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateProjectModal } from '@/components/workspace/CreateProjectModal';
import { CreateTaskModal } from '@/components/workspace/CreateTaskModal';

export const WorkspaceDashboard: React.FC = () => {
  const { currentWorkspace, hasPermission } = useWorkspace();
  const navigate = useNavigate();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useWorkspaceStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const isLoading = statsLoading || projectsLoading || tasksLoading;

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.4em] text-[10px]">
            <Rocket className="h-3 w-3" />
            <span>Mission Control</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
            {currentWorkspace?.name} <span className="text-primary">Ops.</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium max-w-md italic border-l-2 border-primary/20 pl-4">
            Strategic overview of your team's collective velocity and project health.
          </p>
        </div>
        
        <div className="flex gap-2">
          {hasPermission('PROJECT_CREATE') && (
            <Button 
              onClick={() => setCreateProjectOpen(true)}
              variant="outline" 
              className="rounded-xl glass border-white/10 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
          {hasPermission('TASK_CREATE') && (
            <Button 
              onClick={() => setCreateTaskOpen(true)}
              className="rounded-xl shadow-lg shadow-primary/20 font-bold"
            >
              <Zap className="w-4 h-4 mr-2" />
              Rapid Task
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Projects" 
          value={stats?.totalProjects || 0} 
          icon={Folder} 
          variant="primary" 
          delay={100} 
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats?.completedTasks || 0} 
          icon={CheckCircle2} 
          variant="accent" 
          delay={200} 
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats?.pendingTasks || 0} 
          icon={Clock} 
          variant="purple" 
          delay={300} 
        />
        <StatCard 
          title="Team Strength" 
          value={stats?.activeMembers || currentWorkspace?.memberCount || 1} 
          icon={UsersIcon} 
          variant="primary" 
          delay={400} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 glass rounded-xl border-white/10 overflow-hidden group">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center justify-between">
              Active Initiatives
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')} className="group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardTitle>
            <CardDescription>Ongoing strategic projects and their current status.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl w-full" />)
            ) : projects?.slice(0, 4).map((project: any) => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/projects/${project.id}`)}
                className="p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: project.color || '#3B82F6' }}>
                    {project.name[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-sm truncate">{project.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{project.status || 'ACTIVE'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(u => <div key={u} className="w-6 h-6 rounded-full border-2 border-background bg-muted" />)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && projects?.length === 0 && (
              <div className="col-span-full py-10 text-center opacity-50 italic text-sm">No active initiatives found.</div>
            )}
          </CardContent>
        </Card>

        {/* Action Center & Quick Stats */}
        <div className="space-y-6">
          <Card className="glass rounded-xl border-white/10 overflow-hidden bg-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {tasksLoading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
              ) : tasks?.filter((t: any) => t.status !== 'DONE').slice(0, 3).map((task: any) => (
                <div 
                  key={task.id} 
                  onClick={() => navigate(`/team-tasks/${task.id}`)}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <p className="text-sm font-bold truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[8px] font-black uppercase px-1.5 h-4 border-white/10">{task.priority}</Badge>
                    <span className="text-[9px] text-muted-foreground font-bold">In {task.project?.name}</span>
                  </div>
                </div>
              ))}
              {!isLoading && tasks?.filter((t: any) => t.status !== 'DONE').length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-4">No tasks assigned to you right now.</p>
              )}
              <Button 
                variant="ghost" 
                onClick={() => navigate('/team-tasks')}
                className="w-full rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 text-primary"
              >
                View Task Board
              </Button>
            </CardContent>
          </Card>

          <Card className="glass rounded-xl border-white/10 overflow-hidden">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Efficiency Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Workspace Velocity</span>
                  <span className="text-foreground">84%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[84%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProjectModal open={createProjectOpen} onOpenChange={setCreateProjectOpen} />
      <CreateTaskModal open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </div>
  );
};

