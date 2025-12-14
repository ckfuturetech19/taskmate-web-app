import { useState } from 'react';
import AppLayout from '@/components/app/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { Notification, NotificationType } from '@/types/task';
import { Bell, BellOff, CheckCheck, Trash2, Users, CheckSquare, UserPlus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { safeParseDate } from '@/lib/dateUtils';

const notificationIcons: Record<NotificationType, React.ElementType> = {
  task_assigned: CheckSquare,
  task_completed: CheckCheck,
  task_updated: Clock,
  group_joined: UserPlus,
  group_task_added: Users,
};

const notificationColors: Record<NotificationType, string> = {
  task_assigned: 'text-blue-500',
  task_completed: 'text-green-500',
  task_updated: 'text-yellow-500',
  group_joined: 'text-purple-500',
  group_task_added: 'text-indigo-500',
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    toast({
      title: 'Marked as read',
      description: 'Notification has been marked as read.',
    });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast({
      title: 'All notifications marked as read',
      description: `${unreadCount} notifications marked as read.`,
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    const Icon = notificationIcons[type] ?? Bell;
    const colorClass = notificationColors[type] ?? 'text-muted-foreground';
    
    if (!notificationIcons[type]) {
      console.warn('Unknown notification type:', type);
    }
    
    return <Icon className={cn('h-5 w-5', colorClass)} />;
  };

  return (
    <AppLayout title="Notifications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
              className="gap-2"
            >
              {filter === 'all' ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {filter === 'all' ? 'Show Unread' : 'Show All'}
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {filter === 'unread' 
                ? "You're all caught up!" 
                : "You'll receive notifications for group activities and task updates."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <Card 
                key={notification.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-sm",
                  !notification.isRead && "border-l-4 border-l-primary bg-primary/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3 flex-wrap">
                            {notification.groupName && (
                              <Badge variant="outline" className="gap-1.5 text-xs">
                                <Users className="h-3 w-3" />
                                {notification.groupName}
                              </Badge>
                            )}
                            
                            {notification.fromUserName && (
                              <span className="text-xs text-muted-foreground">
                                by {notification.fromUserName}
                              </span>
                            )}
                            
                            <span className="text-xs text-muted-foreground">
                              {(() => {
                                const date = safeParseDate(notification.createdAt);
                                return date ? formatDistanceToNow(date, { addSuffix: true }) : 'Recently';
                              })()}
                            </span>
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="gap-1.5 text-xs"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
