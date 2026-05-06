import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Plus, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RemindersCardProps {
  tasks?: Task[];
  onAddTask?: () => void;
  onStartTimer?: (task: Task) => void;
  className?: string;
}

const RemindersCard = ({ tasks = [], onAddTask, onStartTimer, className }: RemindersCardProps) => {
  const navigate = useNavigate();
  const tasksWithTimers = tasks.filter(t => t.focusTimerEnabled && !t.isCompleted);
  const displayTasks = tasksWithTimers.slice(0, 3);

  const handleStartTimer = (task: Task) => {
    if (onStartTimer) onStartTimer(task);
    navigate('/clock', { state: { taskId: task.id } });
  };

  return (
    <div className={cn("glass rounded-[2rem] border-white/10 p-6 space-y-6 h-full flex flex-col shadow-2xl relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg tracking-tight flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          Focus Timers
        </h3>
        {onAddTask && (
          <Button variant="ghost" size="icon" onClick={onAddTask} className="h-8 w-8 rounded-lg hover:bg-white/5">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {displayTasks.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <div className="relative inline-block">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
                <Timer className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-foreground uppercase tracking-widest">No Active Nodes</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Initialize a focus timer to begin</p>
            </div>
            {onAddTask && (
              <Button onClick={onAddTask} className="rounded-2xl h-12 px-6 font-black bg-primary hover:bg-primary/90 text-xs">
                INITIALIZE
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl glass-dark border-white/5 group hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => handleStartTimer(task)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 opacity-60">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{task.focusDurationMinutes || 25} MIN CYCLE</span>
                  </div>
                </div>
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Play className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
            {tasksWithTimers.length > 3 && (
              <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-[0.2em] pt-2">
                + {tasksWithTimers.length - 3} OTHER STREAMS
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersCard;


