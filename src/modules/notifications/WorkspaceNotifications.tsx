import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare,
  UserPlus,
  Trash2,
  Check,
  CheckCheck,
  X,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  clear: boolean;
  timestamp: string;
}

export const WorkspaceNotifications: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch notifications from correct endpoint
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications/', { params: { limit: 50 } });
      // Backend returns { notifications: [...], pagination: {...} }
      return response.data.notifications as Notification[];
    },
    refetchInterval: 30_000, // auto-refresh every 30s
  });

  const notifications = data ?? [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read
  const markRead = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Mark all as read
  const markAllRead = useMutation({
    mutationFn: () => api.put('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Clear single notification
  const clearOne = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/clear`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  // Clear all notifications
  const clearAll = useMutation({
    mutationFn: () => api.put('/notifications/clear-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_DUE':
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-[var(--brand-pink)]" />;
      case 'PROJECT_UPDATE':
      case 'MILESTONE_UPDATED':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'INVITE_ACCEPTED':
      case 'INVITE_SENT':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'MESSAGE':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-[var(--brand-pink)] text-white font-bold px-2 py-0.5 text-xs rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-[var(--text-muted)] mt-1">Stay updated with your activity.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 w-9 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
          </Button>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="rounded-xl text-xs gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}

          {/* Clear all */}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAll.mutate()}
              disabled={clearAll.isPending}
              className="rounded-xl text-xs gap-1.5 text-red-500 hover:text-red-600 hover:border-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-[72px] rounded-xl bg-[var(--bg-card)] animate-pulse border border-[var(--border-default)]" />
          ))
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markRead.mutate(n.id)}
              className={cn(
                'group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
                n.read
                  ? 'bg-[var(--bg-card)] border-[var(--border-default)] opacity-70'
                  : 'bg-[var(--bg-card)] border-[var(--brand-pink)]/30 shadow-sm shadow-[var(--brand-pink)]/5'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                n.read ? 'bg-[var(--bg-sidebar)]' : 'bg-[var(--brand-pink)]/10'
              )}>
                {getIcon(n.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold truncate', !n.read && 'text-[var(--text-primary)]')}>
                  {n.title}
                </p>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">{n.body}</p>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                  {format(new Date(n.timestamp), 'MMM dd, HH:mm')}
                </span>
                <div className="flex items-center gap-1">
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--brand-pink)]" />
                  )}
                  {/* Clear button (appears on hover) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); clearOne.mutate(n.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-500 p-0.5 rounded"
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center rounded-xl border border-dashed border-[var(--border-default)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7 text-[var(--text-muted)] opacity-40" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">All clear!</h3>
            <p className="text-[var(--text-muted)] text-sm mt-1">You have no notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
