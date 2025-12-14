import { Task, Priority } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Calendar, Repeat, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/TaskContext';
import { safeParseDate, safeIsToday, safeIsPast, safeFormat } from '@/lib/dateUtils';
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

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-chart-1/20 text-chart-1' },
  high: { label: 'High', className: 'bg-destructive/20 text-destructive' },
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const { groups, categories } = useTaskContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const priority = priorityConfig[task.priority];
  const dueDate = safeParseDate(task.dueDate);
  const isOverdue = dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate) && !task.completed;
  const taskGroup = task.groupId ? groups.find(g => g.id === task.groupId) : null;
  const taskCategory = task.categoryId ? categories.find(c => c.id === task.categoryId) : null;

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-sm relative overflow-hidden",
      task.completed && "opacity-60"
    )}>
      {/* Color indicator bar */}
      {task.color && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1" 
          style={{ backgroundColor: task.color }}
        />
      )}
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium text-sm sm:text-base text-foreground break-words",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge className={cn(priority.className, "shrink-0 text-xs")} variant="secondary">
                {priority.label}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {taskGroup && (
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Users className="h-3 w-3" />
                  {taskGroup.name}
                </Badge>
              )}
              {dueDate && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{safeFormat(dueDate, 'MMM d, yyyy', 'No date')}</span>
                </div>
              )}
              {task.recurring !== 'none' && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Repeat className="h-3.5 w-3.5" />
                  <span className="capitalize">{task.recurring}</span>
                </div>
              )}
              {taskCategory && (
                <Badge variant="outline" className="text-xs">
                  {taskCategory.icon && `${taskCategory.icon} `}{taskCategory.name}
                </Badge>
              )}
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs px-2 py-0">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                <Checkbox className="h-3 w-3 inline-block mr-1" />
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
              </div>
            )}
          </div>
          <div className="flex items-start gap-1 shrink-0 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-8 sm:w-8"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TaskCard;
