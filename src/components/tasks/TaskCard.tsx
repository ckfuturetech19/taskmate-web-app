import { Task, PriorityLevel } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Trash2, Calendar, Repeat, Users, Bell } from 'lucide-react';
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

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

const priorityConfig: Record<PriorityLevel, { label: string; className: string }> = {
  none: { label: 'None', className: 'bg-gray-200 text-gray-400' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-chart-1/20 text-chart-1' },
  high: { label: 'High', className: 'bg-destructive/20 text-destructive' },
};

// Helper function to calculate luminance and determine text color
const getTextColor = (backgroundColor: string): string => {
  try {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    if (hex.length !== 6) return '#000000'; // Fallback for invalid hex
    
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Calculate relative luminance (WCAG formula)
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#000000'; // Fallback
  }
};

// Helper to convert hex to rgba with opacity
const hexToRgba = (hex: string, opacity: number): string => {
  try {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return hex; // Fallback
    
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return hex; // Fallback
  }
};

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, readOnly = false }: TaskCardProps) => {
  const { groups, categories } = useTaskContext();
  const { theme } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const priorityLevel = task.priorityLevel || 'none';
  const priority = priorityConfig[priorityLevel as PriorityLevel] || priorityConfig.none;
  const dueDate = safeParseDate(task.dueDate);
  const isOverdue = dueDate && safeIsPast(dueDate) && !safeIsToday(dueDate) && !task.isCompleted;
  const taskGroup = task.groupId ? groups.find(g => g.id === task.groupId) : null;
  const taskCategory = task.categoryId ? categories.find(c => c.id === task.categoryId) : null;

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  const reminder = safeParseDate(task.reminder);
  const reminderTime = reminder ? safeFormat(reminder, 'MMM d, h:mm a', '') : null;

  // ✅ Get color from colorIndex based on theme (matching Flutter sync)
  // Get paletteIndex from user preferences (defaults to 0 - Classic)
  const paletteIndex = getPaletteIndex();
  const taskColor = task.colorIndex !== undefined 
    ? getTaskColor(task.colorIndex, paletteIndex, theme)
    : (task.color || undefined);

  // ✅ Calculate colors for palette-colored card (matching Flutter)
  const cardBackgroundColor = taskColor ? hexToRgba(taskColor, 0.9) : undefined;
  const cardBorderColor = taskColor ? hexToRgba(taskColor, 0.3) : undefined;
  const textColor = taskColor ? getTextColor(taskColor) : undefined;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 relative overflow-hidden cursor-pointer rounded-xl group",
        "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.01]",
        "animate-fade-in",
        task.isCompleted && "opacity-60"
      )}
      style={{
        backgroundColor: cardBackgroundColor,
        borderColor: cardBorderColor,
        borderWidth: taskColor ? 1 : undefined,
        boxShadow: taskColor ? '0 2px 8px rgba(0, 0, 0, 0.1)' : undefined,
      }}
      onClick={readOnly || !onEdit ? undefined : () => onEdit(task)} // Make entire card clickable like Flutter
      className={readOnly || !onEdit ? '' : 'cursor-pointer'}
    >
      <CardContent className="p-3 sm:p-4 md:p-5">
        <div className="flex items-start gap-2 sm:gap-3">
          <div
            className="mt-1 shrink-0 p-0.5 rounded-[2px]"
            style={{
              backgroundColor: textColor ? `${textColor}20` : undefined,
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={task.isCompleted}
                onCheckedChange={readOnly || !onToggleComplete ? undefined : () => onToggleComplete(task.id)}
                disabled={readOnly || !onToggleComplete}
                className="shrink-0"
                style={{
                  color: textColor || undefined,
                  borderColor: textColor ? `${textColor}60` : undefined
                }}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 
                  className={cn(
                    "font-medium text-sm sm:text-base break-words flex-1",
                    task.isCompleted && "line-through opacity-70"
                  )}
                  style={{ color: textColor || undefined }}
                >
                  {task.title}
                </h3>
                {/* Group task indicator - matching Flutter style exactly */}
                {taskGroup && (
                  <div
                    className="flex items-center gap-1.5 shrink-0 ml-1 px-1.5 py-0.5 rounded-md"
                    style={{
                      // Match Flutter: Get.theme.colorScheme.surface.withOpacity(0.12)
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.12)' 
                        : 'rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <Avatar 
                      className="h-5 w-5 shrink-0" 
                      style={{ 
                        // Match Flutter: Get.theme.colorScheme.primary.withOpacity(0.9)
                        backgroundColor: theme === 'dark'
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--primary))',
                        opacity: 0.9,
                      }}
                    >
                      <AvatarFallback 
                        className="text-[10px] font-bold text-white"
                      >
                        {taskGroup.name
                          .trim()
                          .split(/\s+/)
                          .map(word => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="text-[11px] font-semibold truncate max-w-[80px]"
                      style={{ color: textColor || undefined }}
                    >
                      {taskGroup.name}
                    </span>
                  </div>
                )}
              </div>
              <Badge 
                className="shrink-0 text-xs border" 
                variant="outline"
                style={{ 
                  borderColor: textColor ? `${textColor}40` : undefined,
                  backgroundColor: textColor ? `${textColor}15` : undefined,
                  color: textColor || undefined
                }}
              >
                {priority.label}
              </Badge>
            </div>
            {task.description && (
              <p 
                className="text-sm mt-1 line-clamp-2"
                style={{ color: textColor || undefined }}
              >
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {dueDate && (
                <div 
                  className="flex items-center gap-1.5 text-xs"
                  style={{ 
                    color: isOverdue 
                      ? (textColor === '#FFFFFF' ? '#ff6b6b' : '#dc2626')
                      : (textColor || undefined)
                  }}
                >
                  <Calendar className="h-3.5 w-3.5" style={{ color: textColor || undefined }} />
                  <span>{safeFormat(dueDate, 'MMM d, yyyy', 'No date')}</span>
                </div>
              )}
              {reminderTime && (
                <div 
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: textColor || undefined }}
                >
                  <Bell className="h-3.5 w-3.5" style={{ color: textColor || undefined }} />
                  <span>{reminderTime}</span>
                </div>
              )}
              {task.recurrenceType && task.recurrenceType !== 'none' && (
                <div 
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: textColor || undefined }}
                >
                  <Repeat className="h-3.5 w-3.5" style={{ color: textColor || undefined }} />
                  <span className="capitalize">
                    {task.recurrenceType}
                    {task.recurrenceFrequency && task.recurrenceFrequency > 1 && ` (${task.recurrenceFrequency})`}
                  </span>
                </div>
              )}
              {taskCategory && (
                <Badge 
                  variant="outline" 
                  className="text-xs border"
                  style={{ 
                    borderColor: textColor ? `${textColor}40` : undefined,
                    backgroundColor: textColor ? `${textColor}15` : undefined,
                    color: textColor || undefined
                  }}
                >
                  {taskCategory.icon && `${taskCategory.icon} `}{taskCategory.name}
                </Badge>
              )}
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {task.tags.map((tag, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-xs px-2 py-0 border"
                    style={{ 
                      borderColor: textColor ? `${textColor}40` : undefined,
                      backgroundColor: textColor ? `${textColor}15` : undefined,
                      color: textColor || undefined
                    }}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <div 
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: textColor || undefined }}
              >
                <Checkbox 
                  className="h-3 w-3" 
                  style={{ 
                    color: textColor || undefined,
                    borderColor: textColor ? `${textColor}60` : undefined
                  }}
                />
                <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks</span>
              </div>
            )}
          </div>
          {!readOnly && (onEdit || onDelete) && (
            <div className="flex items-start gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 sm:h-8 sm:w-8 transition-all duration-300",
                    "hover:scale-110 hover:bg-primary/10",
                    taskColor && "hover:opacity-80"
                  )}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onEdit(task);
                  }}
                  style={{ 
                    color: textColor,
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-12" />
                </Button>
              )}
              {onDelete && (
                <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-8 sm:w-8 transition-all duration-300",
                "hover:scale-110 hover:bg-destructive/10",
                taskColor && "hover:opacity-80"
              )}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                setShowDeleteDialog(true);
              }}
                  style={{ 
                    color: textColor === '#FFFFFF' ? '#ff6b6b' : '#dc2626',
              }}
            >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-12" />
                </Button>
              )}
            </div>
          )}
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
