import { useState, useEffect } from 'react';
import { Task, PriorityLevel, RecurrenceType, Recurrence, SubTask } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { colorPalettes, getTaskColor, calculateGlobalColorIndex, getPaletteIndices } from '@/lib/colorPalettes';
import { getPaletteIndex } from '@/lib/userPreferences';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Users, X, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { safeParseDate } from '@/lib/dateUtils';
// Removed MUI TimePicker imports
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { fcmService } from '@/services/fcmService';
import { GroupMemberProfile } from '@/types/task';
import { AIService } from '@/services/aiService';
import { Sparkles, Wand2, BrainCircuit, Zap, Check, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  groupId?: string;
  onSave: (data: Partial<Task>) => Promise<void>;
}

const TaskDialog = ({ open, onOpenChange, task, groupId, onSave }: TaskDialogProps) => {
  const { groups, categories, tasks } = useTaskContext();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<number | undefined>(undefined);
  const [recurrence, setRecurrence] = useState<Recurrence | undefined>(undefined);
  // Recurrence sub-features
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [recurrenceEndType, setRecurrenceEndType] = useState<'never' | 'date' | 'count'>('never');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>();
  const [recurrenceEndCount, setRecurrenceEndCount] = useState<number>(10);
  const [useTimeWindow, setUseTimeWindow] = useState(false);
  const [timeWindowStart, setTimeWindowStart] = useState<string>('09:00');
  const [timeWindowEnd, setTimeWindowEnd] = useState<string>('17:00');
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [skipCustomDays, setSkipCustomDays] = useState<number[]>([]);
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>('none');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [showMemberList, setShowMemberList] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
  const [reminder, setReminder] = useState<Date | undefined>();
  const [focusTimerEnabled, setFocusTimerEnabled] = useState<boolean>(false);
  const [focusDurationMinutes, setFocusDurationMinutes] = useState<number>(25);
  const [reminderDate, setReminderDate] = useState<Date | undefined>();
  const [reminderHour, setReminderHour] = useState<string>('12');
  const [reminderMinute, setReminderMinute] = useState<string>('00');
  const [reminderPeriod, setReminderPeriod] = useState<'AM' | 'PM'>('AM');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showRecurrenceEndDatePicker, setShowRecurrenceEndDatePicker] = useState(false);

  // ✅ Auto-calculated colorIndex (matching Flutter - no manual picker)
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Load task data into form when editing
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate ? safeParseDate(task.dueDate) || undefined : undefined);
        setRecurrenceType(task.recurrenceType || 'none');
        setRecurrenceFrequency(task.recurrenceFrequency || 1);
        setPriorityLevel(task.priorityLevel || 'none');
        setCategoryId(task.categoryId || '');
        setTags(task.tags ? task.tags.join(', ') : '');
        setSubtasks(task.subtasks || []);
        setFocusTimerEnabled(task.focusTimerEnabled || false);
        setFocusDurationMinutes(task.focusDurationMinutes || 25);
        setColorIndex(task.colorIndex || 0);
        setAssignedTo(task.groupMembers || []);

        // Handle recurrence sub-features
        if (task.recurrence) {
          setSelectedWeekdays(task.recurrence.daysOfWeek || []);
          if (task.recurrence.endDate) {
            setRecurrenceEndType('date');
            setRecurrenceEndDate(safeParseDate(task.recurrence.endDate) || undefined);
          } else if (task.recurrence.repeatCount) {
            setRecurrenceEndType('count');
            setRecurrenceEndCount(task.recurrence.repeatCount);
          } else {
            setRecurrenceEndType('never');
          }
          setSkipCustomDays(task.recurrence.skipDays || []);
        }

        // Handle time window
        if (task.timeWindowStart || task.timeWindowEnd) {
          setUseTimeWindow(true);
          setTimeWindowStart(task.timeWindowStart || '09:00');
          setTimeWindowEnd(task.timeWindowEnd || '17:00');
        } else {
          setUseTimeWindow(false);
        }

        // Handle reminder
        const reminderDateObj = task.reminder ? safeParseDate(task.reminder) : undefined;
        if (reminderDateObj) {
          setReminder(reminderDateObj);
          setReminderDate(reminderDateObj);
          setReminderHour(reminderDateObj.getHours() > 12 ? (reminderDateObj.getHours() - 12).toString().padStart(2, '0') : (reminderDateObj.getHours() || 12).toString().padStart(2, '0'));
          setReminderMinute(reminderDateObj.getMinutes().toString().padStart(2, '0'));
          setReminderPeriod(reminderDateObj.getHours() >= 12 ? 'PM' : 'AM');
        } else {
          setReminder(undefined);
          setReminderDate(undefined);
        }
      } else {
        // Reset for new task
        setTitle('');
        setDescription('');
        setDueDate(undefined);
        setRecurrenceType('none');
        setRecurrenceFrequency(1);
        setPriorityLevel('none');
        setCategoryId('');
        setTags('');
        setSubtasks([]);
        setFocusTimerEnabled(false);
        setFocusDurationMinutes(25);
        setReminder(undefined);
        setReminderDate(undefined);
        setAssignedTo([]);
        setUseTimeWindow(false);
        setSelectedWeekdays([]);
        setRecurrenceEndType('never');
        setSkipCustomDays([]);

        // Auto-calculate next colorIndex (0-11) within current palette
        const currentPalette = getPaletteIndex();
        const taskCount = tasks.length;
        const localColorIndex = taskCount % 12;
        const globalColorIndex = calculateGlobalColorIndex(currentPalette, localColorIndex);
        setColorIndex(globalColorIndex);
      }
    }
  }, [open, task, tasks.length]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  };

  // Handle opening reminder picker
  const handleOpenReminderPicker = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        // Request permission - this will show browser's native prompt
        const granted = await requestNotificationPermission();
        if (!granted) {
          return false; // User denied or dismissed
        }
      } else if (Notification.permission === 'denied') {
        // Permission was previously denied
        return false; // Let the UI show the warning message
      }
    }
    return true;
  };

  // Date picker: set date, then open time picker
  const handleReminderDateChange = (date: Date | undefined) => {
    if (date) {
      setReminderDate(date);
      setShowDatePicker(false);
      // Initialize time picker with current time if reminder doesn't exist
      if (!reminder) {
        const now = new Date();
        setReminderHour(now.getHours() > 12 ? (now.getHours() - 12).toString().padStart(2, '0') : (now.getHours() || 12).toString().padStart(2, '0'));
        setReminderMinute(now.getMinutes().toString().padStart(2, '0'));
        setReminderPeriod(now.getHours() >= 12 ? 'PM' : 'AM');
      }
      setShowTimePicker(true);
    } else {
      setReminderDate(undefined);
      setReminder(undefined);
    }
  };

  // Time picker: set time, then combine with date
  // Custom time picker handlers
  const handleTimeConfirm = () => {
    if (!reminderDate) return;  // Add null check

    let hour = parseInt(reminderHour, 10);
    if (reminderPeriod === 'PM' && hour !== 12) hour += 12;
    if (reminderPeriod === 'AM' && hour === 12) hour = 0;

    const combined = new Date(reminderDate.getFullYear(), reminderDate.getMonth(),
      reminderDate.getDate(), hour, parseInt(reminderMinute, 10));
    setReminder(combined);  // ✅ Always valid Date
    setShowTimePicker(false);
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  const currentGroup = groupId ? groups.find(g => g.id === groupId) : null;
  const groupMembers = currentGroup?.members || [];

  const getUserDisplay = (profile: GroupMemberProfile | undefined, memberId: string) => {
    if (!profile) return memberId.substring(0, 8);
    if (profile.name) return profile.name;
    if (profile.email) return profile.email.split('@')[0];
    if (currentGroup?.ownerId === memberId) return 'Owner';
    return 'Member';
  };

  const getUserInitials = (profile: GroupMemberProfile | undefined) => {
    if (profile?.name) {
      const parts = profile.name.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    if (profile?.email) return profile.email.substring(0, 2).toUpperCase();
    return 'U';
  };

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: SubTask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st =>
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleSave = async () => {
    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const currentPaletteIndex = getPaletteIndex();
      const selectedColor = getTaskColor(colorIndex, currentPaletteIndex, theme);
      const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(t => t) : undefined;
      let reminderUtc: string | undefined = undefined;
      if (reminder instanceof Date && !isNaN(reminder.getTime())) {
        reminderUtc = reminder.toISOString();
      }

      let finalRecurrence: Recurrence | undefined = undefined;
      if (recurrenceType !== 'none') {
        finalRecurrence = {
          type: recurrenceType,
          interval: recurrenceFrequency || 1,
          daysOfWeek: recurrenceType === 'weekly' && selectedWeekdays.length > 0 ? selectedWeekdays : undefined,
          repeatCount: recurrenceEndType === 'count' ? recurrenceEndCount : undefined,
          endDate: recurrenceEndType === 'date' && recurrenceEndDate ? recurrenceEndDate.toISOString() : undefined,
          skipDays: skipCustomDays.length > 0 ? skipCustomDays : undefined,
          isPaused: false,
        };
      }

      const taskObj: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        recurrenceType,
        recurrenceFrequency,
        recurrence: finalRecurrence,
        timeWindowStart: useTimeWindow ? timeWindowStart : undefined,
        timeWindowEnd: useTimeWindow ? timeWindowEnd : undefined,
        priorityLevel,
        groupId,
        groupMembers: groupId && assignedTo.length > 0 ? assignedTo : undefined,
        color: selectedColor,
        colorIndex: colorIndex,
        categoryId: categoryId.trim() || undefined,
        tags: tagsArray,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
        reminder: reminderUtc,
        reminderUtc: reminderUtc,
        focusTimerEnabled: focusTimerEnabled,
        focusDurationMinutes: focusTimerEnabled ? focusDurationMinutes : 25,
      };

      if (!focusTimerEnabled && task) {
        taskObj.focusTimerStartTime = null;
        taskObj.focusTimerIsRunning = false;
        taskObj.focusTimerRemainingSeconds = null;
      }

      await onSave(taskObj);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in TaskDialog save:', error);
      // Parent handleSaveTask already shows toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiEnhance = async (options: string[]) => {
    if (!title.trim()) return;

    try {
      setIsEnhancing(true);
      toast({ 
        title: '✨ AI is thinking...', 
        description: 'Analyzing your task to provide premium enhancements.' 
      });

      const enhancement = await AIService.enhanceTask(title, options);
      
      if (enhancement) {
        if (enhancement.title && options.includes('Title')) setTitle(enhancement.title);
        if (enhancement.description && options.includes('Description')) setDescription(enhancement.description);
        
        if (enhancement.subtasks && options.includes('Subtasks')) {
          const newSubtasks = enhancement.subtasks.map((st: string) => ({
            id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: st,
            completed: false
          }));
          setSubtasks(prev => [...prev, ...newSubtasks]);
        }

        if (enhancement.dueDate && options.includes('Due Date')) {
          const date = new Date(enhancement.dueDate);
          if (!isNaN(date.getTime())) setDueDate(date);
        }

        if (enhancement.reminder && (options.includes('Due Date') || options.includes('Reminder'))) {
          const rDate = new Date(enhancement.reminder);
          if (!isNaN(rDate.getTime())) {
            setReminder(rDate);
            setReminderDate(rDate);
            setReminderHour(rDate.getHours() > 12 ? (rDate.getHours() - 12).toString().padStart(2, '0') : (rDate.getHours() || 12).toString().padStart(2, '0'));
            setReminderMinute(rDate.getMinutes().toString().padStart(2, '0'));
            setReminderPeriod(rDate.getHours() >= 12 ? 'PM' : 'AM');
          }
        }

        if (enhancement.priority && options.includes('Priority')) {
          setPriorityLevel(enhancement.priority.toLowerCase() as PriorityLevel);
        }

        if (enhancement.category && options.includes('Category')) {
          const match = categories.find(c => c.name.toLowerCase() === enhancement.category.toLowerCase());
          if (match) setCategoryId(match.id);
        }

        toast({ 
          title: '✨ Task Enhanced!', 
          description: 'AI has auto-filled the selected details for you.' 
        });
      }
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      toast({ title: 'AI Error', description: 'Failed to enhance task', variant: 'destructive' });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 sm:p-6">
        <SheetHeader className="pb-3 sm:pb-4">
          <SheetTitle className="text-lg sm:text-xl md:text-2xl">{task ? 'Edit Task' : 'Create Task'}</SheetTitle>
        </SheetHeader>

        {/* Action Buttons at Top */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 py-3 sm:py-4 border-b">
          <Button className="flex-1 w-full sm:w-auto text-sm sm:text-base gap-2" onClick={handleSave} disabled={!title.trim() || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6 py-4 sm:py-5 md:py-6">
          {/* Title - First field matching Flutter */}
          <div className="space-y-2 sm:space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              <span className={cn(
                "text-xs",
                title.length > 60 ? "text-destructive" : "text-muted-foreground"
              )}>
                {title.length}/60
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setTitle(e.target.value);
                  }
                }}
                placeholder="Enter task title"
                maxLength={60}
                className="flex-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={!title.trim() || isEnhancing}
                    className={cn(
                      "transition-all duration-500",
                      title.trim() ? "border-purple-500/50 text-purple-600 bg-purple-500/5 shadow-lg shadow-purple-500/10" : "opacity-50"
                    )}
                  >
                    {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-purple-500/20">
                  <DropdownMenuLabel className="flex items-center gap-2 text-purple-600">
                    <Wand2 className="h-3 w-3" />
                    <span>AI Enhancement</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAiEnhance(['Title', 'Description', 'Subtasks', 'Due Date', 'Category', 'Priority', 'Reminder'])} className="rounded-xl py-2 cursor-pointer gap-2 group">
                    <Zap className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Enhance All</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAiEnhance(['Description'])} className="rounded-xl py-2 cursor-pointer gap-2">
                    <BrainCircuit className="h-4 w-4 text-blue-500" />
                    <span>Description Only</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAiEnhance(['Subtasks'])} className="rounded-xl py-2 cursor-pointer gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Generate Subtasks</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAiEnhance(['Due Date', 'Priority', 'Category'])} className="rounded-xl py-2 cursor-pointer gap-2">
                    <Bell className="h-4 w-4 text-purple-500" />
                    <span>Smart Metadata</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Subtasks - Second field matching Flutter (after title) */}
          <div className="space-y-2 sm:space-y-3">
            <Label>Subtasks</Label>

            {/* Add new subtask */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    value={newSubtaskTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= 60) {
                        setNewSubtaskTitle(e.target.value);
                      }
                    }}
                    placeholder="Add a subtask..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubtask();
                      }
                    }}
                    maxLength={60}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addSubtask}
                  disabled={!newSubtaskTitle.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </div>
              {newSubtaskTitle && (
                <span className={cn(
                  "text-xs ml-1",
                  newSubtaskTitle.length > 60 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {newSubtaskTitle.length}/60
                </span>
              )}
            </div>

            {/* Subtasks list */}
            {subtasks.length > 0 && (
              <div className="space-y-2 border rounded-md p-3">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                    />
                    <span className={cn(
                      "flex-1 text-sm",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeSubtask(subtask.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-2">
                  {subtasks.filter(st => st.completed).length} of {subtasks.length} completed
                </p>
              </div>
            )}
          </div>

          {/* Description - Third field matching Flutter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description (optional)</Label>
              <span className={cn(
                "text-xs",
                description.length > 300 ? "text-destructive" : "text-muted-foreground"
              )}>
                {description.length}/300
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Enter task description"
              rows={3}
              maxLength={300}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Due Date</Label>
              {dueDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setDueDate(undefined)}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
              onClick={() => setShowDueDatePicker(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
            </Button>
          </div>

          {/* Reminder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Reminder (optional)</Label>
              {reminder && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReminder(undefined);
                    setShowDatePicker(false);
                    setShowTimePicker(false);
                  }}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !reminder && "text-muted-foreground"
                )}
                onClick={async () => {
                  // Open picker first for better UX
                  setShowDatePicker(true);

                  // Then handle permissions/token registration in background
                  if ('Notification' in window && user) {
                    if (Notification.permission === 'default') {
                      try {
                        const permission = await Notification.requestPermission();
                        setNotificationPermission(permission);
                        if (permission === 'granted') {
                          await fcmService.requestPermissionAndGetToken(user.id);
                        }
                      } catch (error) {
                        console.error('Error requesting permission:', error);
                      }
                    } else if (Notification.permission === 'granted') {
                      const token = fcmService.getCurrentToken();
                      if (!token) {
                        await fcmService.requestPermissionAndGetToken(user.id);
                      }
                    }
                  }
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                {reminder ? format(reminder, 'PPP p') : 'Set a reminder'}
              </Button>
              {reminder && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTimePicker(true)}
                >
                  <Bell className="h-4 w-4" />
                </Button>
              )}
            </div>
            {notificationPermission === 'denied' && (
              <div className="text-xs p-3 border border-destructive/20 bg-destructive/5 rounded-md">
                <p className="text-destructive font-medium mb-1">⚠️ Notifications Blocked</p>
                <p className="text-muted-foreground">
                  To receive reminders, enable notifications in your browser settings:
                </p>
                <ol className="text-muted-foreground mt-1 ml-4 list-decimal text-[11px]">
                  <li>Click the lock/info icon in the address bar</li>
                  <li>Find "Notifications" and change to "Allow"</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            )}
            {notificationPermission === 'default' && !reminder && (
              <p className="text-xs text-muted-foreground">
                💡 You'll be asked to allow notifications when setting a reminder
              </p>
            )}
          </div>




          {/* Priority - Matching Flutter order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Priority</Label>
              <Select value={priorityLevel} onValueChange={(v) => setPriorityLevel(v as PriorityLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Recurring</Label>
              <Select value={recurrenceType} onValueChange={(v) => {
                setRecurrenceType(v as RecurrenceType);
                if (v === 'none') {
                  setRecurrenceFrequency(undefined);
                  setSelectedWeekdays([]);
                } else if (!recurrenceFrequency) {
                  setRecurrenceFrequency(1);
                }
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ✅ Recurrence Sub-Features - Matching Flutter */}
          {recurrenceType !== 'none' && (
            <div className="space-y-3 sm:space-y-4 border-t pt-3 sm:pt-4">
              {/* Recurrence Frequency */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Repeat Every</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <Select
                    value={recurrenceFrequency?.toString() || '1'}
                    onValueChange={(v) => setRecurrenceFrequency(parseInt(v))}
                  >
                    <SelectTrigger className="w-16 sm:w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    {recurrenceType === 'daily' ? (recurrenceFrequency === 1 ? 'day' : 'days') :
                      recurrenceType === 'weekly' ? (recurrenceFrequency === 1 ? 'week' : 'weeks') :
                        recurrenceType === 'monthly' ? (recurrenceFrequency === 1 ? 'month' : 'months') :
                          recurrenceType === 'yearly' ? (recurrenceFrequency === 1 ? 'year' : 'years') :
                            recurrenceType === 'custom' ? 'times' : ''}
                  </span>
                </div>
              </div>

              {/* Weekly Day Selection */}
              {recurrenceType === 'weekly' && (
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Repeat On</Label>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                      const isSelected = selectedWeekdays.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedWeekdays(prev => prev.filter(d => d !== idx));
                            } else {
                              setSelectedWeekdays(prev => [...prev, idx].sort());
                            }
                          }}
                          className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-medium transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* End Conditions */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">End Recurrence</Label>
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="end-never"
                      name="recurrence-end"
                      checked={recurrenceEndType === 'never'}
                      onChange={() => setRecurrenceEndType('never')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="end-never" className="font-normal cursor-pointer">Never</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="end-date"
                      name="recurrence-end"
                      checked={recurrenceEndType === 'date'}
                      onChange={() => setRecurrenceEndType('date')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="end-date" className="font-normal cursor-pointer">On Date</Label>
                    {recurrenceEndType === 'date' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRecurrenceEndDatePicker(true)}
                        className="ml-2 text-xs sm:text-sm"
                      >
                        <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        <span className="hidden sm:inline">{recurrenceEndDate ? format(recurrenceEndDate, 'MMM d, yyyy') : 'Select date'}</span>
                        <span className="sm:hidden">{recurrenceEndDate ? format(recurrenceEndDate, 'MMM d') : 'Date'}</span>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="end-count"
                      name="recurrence-end"
                      checked={recurrenceEndType === 'count'}
                      onChange={() => setRecurrenceEndType('count')}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="end-count" className="font-normal cursor-pointer">After</Label>
                    {recurrenceEndType === 'count' && (
                      <div className="flex items-center gap-2 ml-2 flex-wrap">
                        <Input
                          type="number"
                          min="1"
                          value={recurrenceEndCount}
                          onChange={(e) => setRecurrenceEndCount(parseInt(e.target.value) || 10)}
                          className="w-16 sm:w-20 text-sm"
                        />
                        <span className="text-xs sm:text-sm text-muted-foreground">occurrences</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Window Settings */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-time-window"
                    checked={useTimeWindow}
                    onCheckedChange={(checked) => setUseTimeWindow(checked as boolean)}
                  />
                  <Label htmlFor="use-time-window" className="font-normal cursor-pointer text-sm sm:text-base">Time Window (Optional)</Label>
                </div>
                {useTimeWindow && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pl-6 sm:pl-7">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs sm:text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={timeWindowStart}
                        onChange={(e) => setTimeWindowStart(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs sm:text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={timeWindowEnd}
                        onChange={(e) => setTimeWindowEnd(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Skip Days Settings */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Skip Days (Optional)</Label>
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="skip-weekends"
                      checked={skipWeekends}
                      onCheckedChange={(checked) => {
                        setSkipWeekends(checked as boolean);
                        if (checked) {
                          setSkipCustomDays(prev => {
                            const newDays = [...prev];
                            if (!newDays.includes(0)) newDays.push(0);
                            if (!newDays.includes(6)) newDays.push(6);
                            return newDays.sort();
                          });
                        } else {
                          setSkipCustomDays(prev => prev.filter(d => d !== 0 && d !== 6));
                        }
                      }}
                    />
                    <Label htmlFor="skip-weekends" className="font-normal cursor-pointer text-sm sm:text-base">Skip Weekends</Label>
                  </div>
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label className="text-xs sm:text-sm">Skip Custom Days</Label>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                        const isSkipped = skipCustomDays.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (isSkipped) {
                                setSkipCustomDays(prev => prev.filter(d => d !== idx));
                                if (idx === 0 || idx === 6) {
                                  setSkipWeekends(false);
                                }
                              } else {
                                setSkipCustomDays(prev => [...prev, idx].sort());
                                if ((idx === 0 && skipCustomDays.includes(6)) || (idx === 6 && skipCustomDays.includes(0))) {
                                  setSkipWeekends(true);
                                }
                              }
                            }}
                            className={cn(
                              "w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-medium transition-colors border-2",
                              isSkipped
                                ? "bg-destructive/20 text-destructive border-destructive"
                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                            )}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category - Matching Flutter order */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Category (optional)</Label>
              {categoryId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCategoryId('')}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <Select value={categoryId || undefined} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon && `${category.icon} `}{category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group task specific sections - Matching Flutter order */}
          {groupId && groupMembers.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assign To ({assignedTo.length} selected)
              </Label>

              {/* Selected members badges */}
              {assignedTo.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                  {assignedTo.map(memberId => {
                    const profile = groupMembers.find(m => m.id === memberId);
                    return (
                      <Badge key={memberId} variant="secondary" className="gap-1.5 pr-1">
                        <Avatar className="h-4 w-4">
                          {profile?.photoURL && <AvatarImage src={profile.photoURL} />}
                          <AvatarFallback className="text-[10px]">{getUserInitials(profile)}</AvatarFallback>
                        </Avatar>
                        <span>{memberId === user?.id ? 'Me' : getUserDisplay(profile, memberId)}</span>
                        <button
                          onClick={() => removeMember(memberId)}
                          className="ml-1 hover:bg-background rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Member selection list */}
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {groupMembers.map(profile => {
                  const isSelected = assignedTo.includes(profile.id);
                  const isOwner = currentGroup?.ownerId === profile.id;

                  return (
                    <div
                      key={profile.id}
                      className={cn(
                        "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => toggleMember(profile.id)}
                    >
                      <Checkbox checked={isSelected} />
                      <Avatar className="h-8 w-8">
                        {profile?.photoURL && <AvatarImage src={profile.photoURL} />}
                        <AvatarFallback className="text-xs">{getUserInitials(profile)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {profile.id === user?.id ? 'Me' : getUserDisplay(profile, profile.id)}
                          {isOwner && <Badge variant="outline" className="ml-2 text-xs">Owner</Badge>}
                        </p>
                        {profile?.email && profile.name && (
                          <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                Task will be assigned to {assignedTo.length} member{assignedTo.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* ✅ Auto-assigned Task Color (matching Flutter - no manual picker) */}
          {!task && (
            <div className="space-y-2">
              <Label>Task Color</Label>
              <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                <div
                  className="w-12 h-12 rounded-md border-2 border-foreground/20"
                  style={{
                    backgroundColor: getTaskColor(colorIndex, getPaletteIndex(), theme),
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Auto-assigned color
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Color is automatically selected based on task count (matching Flutter)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Focus Timer - Matching Flutter */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="focus-timer-enabled"
                checked={focusTimerEnabled}
                onCheckedChange={(checked) => setFocusTimerEnabled(checked as boolean)}
              />
              <Label htmlFor="focus-timer-enabled" className="font-normal cursor-pointer text-sm sm:text-base">
                Enable Focus Timer
              </Label>
            </div>
            {focusTimerEnabled && (
              <div className="pl-6 sm:pl-7 space-y-2">
                <Label className="text-sm">Focus Duration (minutes)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="480"
                    value={focusDurationMinutes}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 25;
                      setFocusDurationMinutes(Math.min(Math.max(value, 1), 480));
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {focusDurationMinutes === 1 ? 'minute' : 'minutes'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Set a timer to focus on this task. Use the clock feature to start the timer.
                </p>
              </div>
            )}
          </div>

          {/* Tags - Additional field */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., urgent, meeting, review"
            />
          </div>
        </div>
      </SheetContent>

      {/* Reminder Date Picker Dialog */}
      <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Reminder Date</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={reminderDate}
            onSelect={handleReminderDateChange}
            initialFocus
            className="rounded-md border"
          />
        </DialogContent>
      </Dialog>

      {/* Custom Time Picker Dialog */}
      <Dialog open={showTimePicker} onOpenChange={setShowTimePicker}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Select Reminder Time</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center justify-center py-4">
            <select
              className="rounded-md border bg-background text-foreground px-2 py-1"
              value={reminderHour}
              onChange={e => setReminderHour(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const val = (i + 1).toString().padStart(2, '0');
                return <option key={val} value={val}>{val}</option>;
              })}
            </select>
            :
            <select
              className="rounded-md border bg-background text-foreground px-2 py-1"
              value={reminderMinute}
              onChange={e => setReminderMinute(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => {
                const min = i.toString().padStart(2, '0');
                return <option key={min} value={min}>{min}</option>;
              })}
            </select>
            <select
              className="rounded-md border bg-background text-foreground px-2 py-1"
              value={reminderPeriod}
              onChange={e => setReminderPeriod(e.target.value as 'AM' | 'PM')}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleTimeCancel}>Cancel</Button>
            <Button onClick={handleTimeConfirm}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Due Date Picker Dialog */}
      <Dialog open={showDueDatePicker} onOpenChange={setShowDueDatePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Due Date</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={(date) => {
              setDueDate(date);
              setShowDueDatePicker(false);
            }}
            initialFocus
            className="rounded-md border"
          />
        </DialogContent>
      </Dialog>

      {/* Recurrence End Date Picker Dialog */}
      <Dialog open={showRecurrenceEndDatePicker} onOpenChange={setShowRecurrenceEndDatePicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Recurrence End Date</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={recurrenceEndDate}
            onSelect={(date) => {
              setRecurrenceEndDate(date);
              setShowRecurrenceEndDatePicker(false);
            }}
            initialFocus
            className="rounded-md border"
          />
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

export default TaskDialog;
