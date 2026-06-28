import { Task, PriorityLevel } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Bell, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/TaskContext';
import { safeParseDate, safeIsToday, safeIsPast, safeFormat } from '@/lib/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const priorityConfig: Record<PriorityLevel, { label: string; class: string }> = {
  none: { label: 'Standard', class: 'bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] border-transparent' },
  low: { label: 'Low', class: 'bg-[#00C9A7]/10 text-[#00C9A7] border-transparent' },
  medium: { label: 'High', class: 'bg-[#FFB300]/10 text-[#FFB300] border-transparent' },
  high: { label: 'Urgent', class: 'bg-[#FF4757]/10 text-[#FF4757] border-transparent' },
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, readOnly = false }: TaskCardProps) => {
  const { groups, categories } = useTaskContext();
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
      whileHover={{ y: -2 }}
      className="group relative"
    >
      {/* Accent hover left border line */}
      <div className="absolute left-0 top-[1px] bottom-[1px] w-[3px] bg-[var(--brand-pink)] rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20" />
      
      <Card 
        className={cn(
          "bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[16px] overflow-hidden transition-all duration-200",
          "hover:shadow-[var(--shadow-card-hover)]",
          task.isCompleted && "opacity-60"
        )}
        onClick={() => !readOnly && onEdit?.(task)}
      >
        <CardContent className="p-4 px-5">
          <div className="flex items-start gap-4">
            
            {/* Custom 20px Circular Checkbox */}
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onToggleComplete?.(task.id); 
                }}
                disabled={readOnly}
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0",
                  task.isCompleted 
                    ? "bg-[var(--brand-gradient)] border-transparent text-white" 
                    : "border-[var(--border-strong)] bg-transparent hover:bg-[var(--brand-pink)]/20 hover:border-[var(--brand-pink)]"
                )}
              >
                {task.isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className={cn(
                    "text-[15px] font-medium tracking-tight break-words",
                    task.isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"
                  )}>
                    {task.title}
                  </h3>
                  
                  {taskGroup && (
                    <span className="inline-block text-[11px] text-[var(--text-muted)]">
                      group: {taskGroup.name}
                    </span>
                  )}
                </div>

                <Badge variant="outline" className={cn("rounded-full text-[11px] font-medium px-2.5 py-0.5 capitalize shrink-0", priority.class)}>
                  {priority.label}
                </Badge>
              </div>

              {task.description && (
                <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {dueDate && (
                  <div className={cn(
                    "flex items-center gap-1 text-[12px] font-medium", 
                    isOverdue ? "text-[var(--status-danger)]" : "text-[var(--text-secondary)]"
                  )}>
                    <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span>{safeFormat(dueDate, 'MMM d', '')}</span>
                  </div>
                )}
                
                {reminderTime && (
                  <div className="flex items-center gap-1 text-[12px] font-medium text-[var(--brand-pink)]">
                    <Bell className="h-3.5 w-3.5" />
                    <span>{reminderTime}</span>
                  </div>
                )}

                {taskCategory && (
                  <span className="text-[12px] text-[var(--text-muted)]">
                    • {taskCategory.name}
                  </span>
                )}
              </div>
            </div>

            {/* Action Dropdown Menu (only shows on hover) */}
            {!readOnly && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-[12px] p-1 shadow-md">
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onEdit?.(task); 
                      }}
                      className="rounded-[8px] h-9 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] focus:bg-[var(--bg-card-hover)]"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-2 text-[var(--brand-purple)]" />
                      Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowDeleteDialog(true); 
                      }}
                      className="rounded-[8px] h-9 text-[13px] font-semibold text-[var(--status-danger)] hover:bg-red-500/10 focus:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete Task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--bg-card)] rounded-[20px] border border-[var(--border-default)] shadow-[var(--shadow-modal)] p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold text-[18px] text-[var(--text-primary)]">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-[var(--text-secondary)]">
              This will permanently remove "{task.title}" from your tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel className="rounded-full h-9 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete?.(task.id)}
              className="rounded-full h-9 bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90 text-[13px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TaskCard;
