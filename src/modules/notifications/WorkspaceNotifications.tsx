import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

export const WorkspaceNotifications: React.FC = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['workspace-notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications/workspace/');
      return response.data.success ? response.data.data : response.data;
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED': return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'PROJECT_UPDATE': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'INVITE_ACCEPTED': return <UserPlus className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with workspace activities.</p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-20 glass animate-pulse rounded-xl" />)
        ) : notifications?.length > 0 ? (
          notifications.map((n: any) => (
            <Card key={n.id} className="glass border-white/10 rounded-xl overflow-hidden hover:bg-white/5 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {format(new Date(n.createdAt), 'MMM dd, HH:mm')}
                  </span>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center glass rounded-xl border-dashed border-white/20">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold">All clear!</h3>
            <p className="text-muted-foreground">You have no new notifications in this workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};
