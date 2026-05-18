import React, { useState } from 'react';
import { useTasks } from '@/hooks/workspace/useTasks';
import { useProjects } from '@/hooks/workspace/useProjects';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  Calendar,
  User,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Layout
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CreateTaskModal } from '@/components/workspace/CreateTaskModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkspace } from '@/providers/WorkspaceProvider';

export const TeamTaskList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectId, setProjectId] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = useWorkspace();
  
  const { data: tasks, isLoading, updateTask } = useTasks(projectId === 'all' ? undefined : projectId);
  const { data: projects } = useProjects();

  const filteredTasks = tasks?.filter((t: any) => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return <ArrowUpCircle className="w-4 h-4 text-rose-500" />;
      case 'URGENT': return <ArrowUpCircle className="w-4 h-4 text-rose-600 animate-pulse" />;
      case 'MEDIUM': return <ArrowRightCircle className="w-4 h-4 text-amber-500" />;
      case 'LOW': return <ArrowDownCircle className="w-4 h-4 text-blue-500" />;
      default: return <ArrowRightCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'TODO': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
      'IN_PROGRESS': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'REVIEW': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'DONE': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
      <Badge className={cn("rounded-md border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", variants[status] || variants['TODO'])}>
        {status?.replace('_', ' ') || 'TODO'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Team Tasks</h1>
          <p className="text-muted-foreground">Collaborate on tasks across your workspace.</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('TASK_CREATE') && (
            <Button 
              onClick={() => setCreateModalOpen(true)}
              className="rounded-xl shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search team tasks..." 
            className="pl-10 rounded-xl bg-muted/30 border-none h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-[200px] rounded-xl bg-muted/30 border-none h-11 font-bold">
            <Layout className="w-4 h-4 mr-2 text-primary" />
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent className="glass border-white/10 rounded-xl">
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map((p: any) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="rounded-xl border-white/10 glass h-11 font-bold px-6">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[400px] pl-8 font-black uppercase text-[10px] tracking-[0.2em] py-6">Task Title</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-[0.2em]">Status</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-[0.2em]">Priority</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-[0.2em]">Assignee</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-[0.2em]">Due Date</TableHead>
              <TableHead className="w-[50px] pr-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell className="pl-8"><div className="h-4 w-48 bg-white/5 animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-white/5 animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-white/5 animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-8 w-8 rounded-full bg-white/5 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-white/5 animate-pulse rounded" /></TableCell>
                  <TableCell className="pr-8"></TableCell>
                </TableRow>
              ))
            ) : filteredTasks?.map((task: any) => (
              <TableRow 
                key={task.id} 
                className="border-white/5 hover:bg-white/5 transition-all group cursor-pointer"
                onClick={() => navigate(`/team-tasks/${task.id}`)}
              >
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = task.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';
                        updateTask.mutate({ status: newStatus });
                      }}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {task.status === 'DONE' ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <p className={cn("font-bold text-sm", task.status === 'DONE' && "line-through text-muted-foreground")}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="font-black uppercase tracking-widest text-primary/70">{task.project?.name || 'No Project'}</span>
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(task.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    {getPriorityIcon(task.priority)}
                    {task.priority || 'Medium'}
                  </div>
                </TableCell>
                <TableCell>
                  {task.assignee ? (
                    <Avatar className="w-9 h-9 rounded-xl border border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={task.assignee?.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black uppercase">
                        {task.assignee?.name?.substring(0, 2).toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-9 h-9 rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center text-muted-foreground">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No date'}
                  </div>
                </TableCell>
                <TableCell className="pr-8">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open more options
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {(!isLoading && filteredTasks?.length === 0) && (
          <div className="py-24 text-center">
            <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h3 className="text-xl font-black">No team tasks found</h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto">Try adjusting your filters or search term to find what you're looking for.</p>
            <Button 
              variant="link" 
              onClick={() => setCreateModalOpen(true)}
              className="mt-4 text-primary font-black uppercase tracking-widest text-[10px]"
            >
              Assign first task
            </Button>
          </div>
        )}
      </div>

      <CreateTaskModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
};

