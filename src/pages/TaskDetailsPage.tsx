import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/app/AppLayout';
import { useTask, useTaskComments, useTaskActivities } from '@/hooks/workspace/useTasks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  MessageSquare, 
  History,
  Send,
  MoreVertical,
  Trash2,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading: taskLoading, updateTask, deleteTask } = useTask(id!);
  const { data: comments, isLoading: commentsLoading, addComment } = useTaskComments(id!);
  const { data: activities, isLoading: activitiesLoading } = useTaskActivities(id!);
  const [commentText, setCommentText] = useState('');

  if (taskLoading) return <TaskSkeleton />;

  const handleToggleStatus = () => {
    const newStatus = task.status === 'DONE' ? 'IN_PROGRESS' : 'DONE';
    updateTask.mutate({ status: newStatus });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment.mutate(commentText);
    setCommentText('');
  };

  return (
    <AppLayout title={`Task: ${task?.title || 'Loading...'}`}>
      <div className="space-y-6 pb-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="rounded-xl hover:bg-white/5 mb-2 -ml-2 text-muted-foreground font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Task Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleToggleStatus}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                    task.status === 'DONE' 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-primary/50 text-transparent hover:border-primary"
                  )}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <h1 className={cn(
                  "text-3xl sm:text-5xl font-black tracking-tight",
                  task.status === 'DONE' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h1>
              </div>
              <p className="text-muted-foreground text-lg font-medium pl-12">
                {task.description || 'No description provided for this task.'}
              </p>
            </div>

            {/* Comments Section */}
            <Card className="glass rounded-xl border-white/10 overflow-hidden mt-10">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Discussions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                {/* Comment Input */}
                <div className="flex gap-3 items-end">
                  <Avatar className="w-10 h-10 rounded-xl border border-white/10">
                    <AvatarFallback className="bg-primary/10 text-primary font-black">Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Add a comment..." 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      className="rounded-xl bg-white/5 border-white/10 pr-12 py-6" 
                    />
                    <Button 
                      onClick={handleAddComment}
                      size="icon" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-8 w-8"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6 mt-8">
                  {commentsLoading ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                  ) : comments?.length > 0 ? (
                    comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar className="w-10 h-10 rounded-xl border border-white/10 shrink-0">
                          <AvatarImage src={comment.user?.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">
                            {comment.user?.name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold">{comment.user?.name}</p>
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                              {format(new Date(comment.createdAt), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-medium">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-50">
                      <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-[0.2em]">No comments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="glass rounded-xl border-white/10 overflow-hidden">
              <CardHeader className="p-8 pb-4 border-b border-white/5">
                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Properties</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Circle className="w-4 h-4" />
                      <span className="text-sm font-bold">Status</span>
                    </div>
                    <Badge variant="outline" className="rounded-lg font-black uppercase tracking-widest text-[9px] px-3">
                      {task.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-bold">Priority</span>
                    </div>
                    <Badge className={cn(
                      "rounded-lg font-black uppercase tracking-widest text-[9px] px-3",
                      task.priority === 'HIGH' ? "bg-rose-500" : task.priority === 'MEDIUM' ? "bg-amber-500" : "bg-blue-500"
                    )}>
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-bold">Assignee</span>
                    </div>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{task.assignee.name}</span>
                        <Avatar className="w-6 h-6 rounded-lg border border-white/10">
                          <AvatarImage src={task.assignee.avatarUrl} />
                          <AvatarFallback className="text-[8px]">{task.assignee.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-bold">Unassigned</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-bold">Due Date</span>
                    </div>
                    <span className="text-xs font-bold">
                      {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-xl border-white/10 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                  {activitiesLoading ? (
                    <Skeleton className="h-40 w-full rounded-xl" />
                  ) : activities?.length > 0 ? (
                    activities.map((activity: any) => (
                      <div key={activity.id} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <p className="text-xs font-medium">
                          <span className="font-bold">{activity.user?.name}</span> {activity.description}
                        </p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                          {format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-muted-foreground py-4 italic">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

const TaskSkeleton = () => (
  <AppLayout title="Loading Task...">
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/4 rounded-xl" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4 rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl mt-10" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </AppLayout>
);
