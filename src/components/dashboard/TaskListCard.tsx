import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Leaf, Settings, TrendingUp, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { safeFormat, safeParseDate } from '@/lib/dateUtils';

interface TaskListCardProps {
  tasks: Task[];
  onAddTask?: () => void;
  onTaskClick?: (task: Task) => void;
  className?: string;
}

const iconMap: Record<string, any> = {
  default: Circle,
  zap: Zap,
  leaf: Leaf,
  settings: Settings,
  trending: TrendingUp,
};

const colorMap: Record<string, string> = {
  default: 'text-blue-500',
  zap: 'text-blue-500',
  leaf: 'text-green-500',
  settings: 'text-orange-500',
  trending: 'text-yellow-500',
};

const TaskListCard = ({ tasks, onAddTask, onTaskClick, className }: TaskListCardProps) => {
  const displayTasks = tasks.slice(0, 5);
  const taskIcons = ['zap', 'leaf', 'settings', 'trending', 'default'];

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg h-full flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
        <CardTitle className="text-base font-semibold">Task</CardTitle>
        {onAddTask && (
          <Button variant="ghost" size="sm" onClick={onAddTask} className="h-8 gap-1">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {displayTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
          ) : (
            displayTasks.map((task, index) => {
              const IconComponent = iconMap[taskIcons[index % taskIcons.length]] || Circle;
              const iconColor = colorMap[taskIcons[index % taskIcons.length]] || 'text-blue-500';
              const dueDateObj = safeParseDate(task.dueDate);
              const dueDate = dueDateObj ? safeFormat(dueDateObj, 'MMM d, yyyy', '') : null;

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                    {dueDate && (
                      <p className="text-xs text-muted-foreground">Due date: {dueDate}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskListCard;

