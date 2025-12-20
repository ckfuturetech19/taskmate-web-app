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
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full text-xs sm:text-sm shrink-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              {filter === 'all' ? <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <BellOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="hidden sm:inline">{filter === 'all' ? 'Show Unread' : 'Show All'}</span>
              <span className="sm:hidden">{filter === 'all' ? 'Unread' : 'All'}</span>
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Mark All Read</span>
                <span className="sm:hidden">All Read</span>
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
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                    <div className="mt-0.5 sm:mt-1 shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base break-words">
                            {notification.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            {notification.groupName && (
                              <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs">
                                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span className="truncate max-w-[100px] sm:max-w-none">{notification.groupName}</span>
                              </Badge>
                            )}
                            
                            {notification.fromUserName && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                by {notification.fromUserName}
                              </span>
                            )}
                            
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
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
                            className="gap-1.5 text-[10px] sm:text-xs shrink-0"
                          >
                            <CheckCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span className="hidden sm:inline">Mark Read</span>
                            <span className="sm:hidden">Read</span>
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
