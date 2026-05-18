import { Task, PriorityLevel } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Trash2, Calendar, Repeat, Users, Bell, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/TaskContext';
import { useTheme } from '@/contexts/ThemeContext';
import { safeParseDate, safeIsToday, safeIsPast, safeFormat } from '@/lib/dateUtils';
import { getTaskColor } from '@/lib/colorPalettes';
import { getPaletteIndex } from '@/lib/userPreferences';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const priorityConfig: Record<PriorityLevel, { label: string; color: string; glow: string }> = {
  none: { label: 'Standard', color: 'text-muted-foreground', glow: 'shadow-white/5' },
  low: { label: 'Low', color: 'text-blue-400', glow: 'shadow-blue-500/10' },
  medium: { label: 'Medium', color: 'text-amber-400', glow: 'shadow-amber-500/10' },
  high: { label: 'Critical', color: 'text-rose-400', glow: 'shadow-rose-500/10' },
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, readOnly = false }: TaskCardProps) => {
  const { groups, categories } = useTaskContext();
  const { theme } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const priority = priorityConfig[task.priorityLevel as PriorityLevel] || priorityConfig.none;
  const dueDate = safeParseDate(task.dueDate);
  const isOverdue = dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate) && !task.isCompleted;
  const taskGroup = task.groupId ? groups.find(g => g.id === task.groupId) : null;
  const taskCategory = task.categoryId ? categories.find(c => c.id === task.categoryId) : null;

  const reminder = safeParseDate(task.reminder);
  const reminderTime = reminder ? safeFormat(reminder, 'h:mm a', '') : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <Card 
        className={cn(
          "glass rounded-xl border-white/5 overflow-hidden transition-all duration-300",
          "hover:border-white/10 hover:shadow-2xl",
          priority.glow,
          task.isCompleted && "opacity-60 grayscale-[0.5]"
        )}
        onClick={() => !readOnly && onEdit?.(task)}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Action Zone */}
            <div className="flex flex-col items-center gap-3 pt-1">
              <div onClick={(e) => e.stopPropagation()} className="relative flex items-center justify-center">
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={() => onToggleComplete?.(task.id)}
                  disabled={readOnly}
                  className="h-6 w-6 rounded-lg border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {task.isCompleted && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  >
                    <Sparkles className="h-4 w-4 text-white animate-pulse" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Content Zone */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className={cn(
                    "text-lg font-black tracking-tight transition-all duration-500 break-words",
                    task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                  )}>
                    {task.title}
                  </h3>
                  
                  {taskGroup && (
                    <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 w-fit">
                      <Users className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{taskGroup.name}</span>
                    </div>
                  )}
                </div>

                <Badge variant="outline" className={cn("rounded-full border-white/5 font-black text-[10px] uppercase tracking-widest px-3 py-1", priority.color, "bg-white/5")}>
                  {priority.label}
                </Badge>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground font-bold line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {dueDate && (
                  <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", isOverdue ? "text-rose-500" : "text-muted-foreground")}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{safeFormat(dueDate, 'MMM d', '')}</span>
                  </div>
                )}
                
                {reminderTime && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Bell className="h-3.5 w-3.5" />
                    <span>{reminderTime}</span>
                  </div>
                )}

                {taskCategory && (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>{taskCategory.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel */}
            {!readOnly && (
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-white/5 hover:text-primary transition-all"
                  onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                  onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass rounded-xl border-white/10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black tracking-tight text-2xl">TERMINATE TASK?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-bold">
              This will permanently remove "{task.title}" from the Task Matrix.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl font-black">CANCEL</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.(task.id)}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 font-black"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TaskCard;
