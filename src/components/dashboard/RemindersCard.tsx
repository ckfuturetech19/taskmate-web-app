import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Plus, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { useNavigate } from 'react-router-dom';

interface RemindersCardProps {
  tasks?: Task[];
  onAddTask?: () => void;
  onStartTimer?: (task: Task) => void;
  className?: string;
}

const RemindersCard = ({ tasks = [], onAddTask, onStartTimer, className }: RemindersCardProps) => {
  const navigate = useNavigate();
  
  // Filter tasks with focus timers enabled
  const tasksWithTimers = tasks.filter(t => t.focusTimerEnabled && !t.isCompleted);
  const displayTasks = tasksWithTimers.slice(0, 3);

  const handleStartTimer = (task: Task) => {
    if (onStartTimer) {
      onStartTimer(task);
    }
    // Navigate to clock page with task selected
    navigate('/clock', { state: { taskId: task.id } });
  };

  return (
    <Card 
      className={cn("transition-all duration-300 hover:shadow-lg border-primary/20 h-full flex flex-col", className)}
      style={{ background: 'linear-gradient(180deg, rgba(30, 111, 67, 0.1), rgba(47, 174, 114, 0.15))' }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
        <CardTitle className="text-base font-semibold" style={{ background: 'linear-gradient(135deg, #1E6F43, #2FAE72)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Focus Timers
        </CardTitle>
        {onAddTask && (
          <Button variant="ghost" size="sm" onClick={onAddTask} className="h-8">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {displayTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="relative inline-block mb-3">
              <Timer className="h-12 w-12 mx-auto text-primary/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-xl" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">No focus timers</p>
            <p className="text-xs text-muted-foreground mb-4">
              Enable focus timer when creating a task
            </p>
            {onAddTask && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddTask} 
                className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 hover:border-primary/40 hover:shadow-sm transition-all duration-300 cursor-pointer group"
                onClick={() => handleStartTimer(task)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Timer className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                    <p className="text-xs text-muted-foreground">
                      {task.focusDurationMinutes || 25} minutes
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartTimer(task);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {tasksWithTimers.length > 3 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{tasksWithTimers.length - 3} more task{tasksWithTimers.length - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersCard;

