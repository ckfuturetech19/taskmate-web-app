import { Button } from '@/components/ui/button';
import { Zap, Plus, Play, ArrowRight } from 'lucide-react';
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
    <div className={cn(
      "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-5 h-full flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-250 overflow-hidden relative",
      className
    )}>
      {/* Subtle purple tint background blob */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7B2FBE]/5 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[#7B2FBE]/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-[#7B2FBE]" />
          </div>
          <h3 className="font-semibold text-[15px] text-[var(--text-primary)]">Focus Timers</h3>
        </div>
        {onAddTask && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onAddTask} 
            className="h-7 w-7 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center relative">
        {displayTasks.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            {/* Clean icon — no gradient abuse */}
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-center">
                <Zap className="h-7 w-7 text-[var(--text-muted)]" />
              </div>
              {/* Small status dot */}
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-default)] flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] block" />
              </span>
            </div>

            <div>
              <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">No active timers</p>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                Start a focus session to<br />track deep work sessions
              </p>
            </div>

            <button
              onClick={() => navigate('/clock')}
              className="flex items-center gap-1.5 px-4 h-8 rounded-lg text-[12px] font-semibold text-[#7B2FBE] bg-[#7B2FBE]/8 hover:bg-[#7B2FBE]/14 border border-[#7B2FBE]/20 transition-all duration-150"
            >
              Start Session
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-default)] hover:border-[#7B2FBE]/30 bg-[var(--bg-card-hover)] hover:bg-[#7B2FBE]/4 transition-all duration-150 cursor-pointer group"
                onClick={() => handleStartTimer(task)}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate group-hover:text-[#7B2FBE] transition-colors">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {task.focusDurationMinutes || 25} min focus
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-[#7B2FBE]/10 text-[#7B2FBE] flex items-center justify-center shrink-0 group-hover:bg-[#7B2FBE] group-hover:text-white transition-all duration-150">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </div>
              </motion.div>
            ))}
            {tasksWithTimers.length > 3 && (
              <p className="text-[11px] text-center text-[var(--text-muted)] pt-1">
                +{tasksWithTimers.length - 3} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersCard;
