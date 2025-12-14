import { useState, useEffect } from 'react';
import { Task, Priority, RecurringType, SubTask } from '@/types/task';
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
import { Timestamp } from 'firebase/firestore';
import { CalendarIcon, Users, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
// Removed MUI TimePicker imports
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fcmService } from '@/services/fcmService';

interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  username?: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  groupId?: string;
  onSave: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    recurring: RecurringType;
    priority: Priority;
    groupId?: string;
    groupMembers?: string[];
    color?: string;
    colorIndex?: number;
    categoryId?: string;
    tags?: string[];
    subtasks?: SubTask[];
    reminder?: string;
    reminderTimezone?: string;
  }) => void;
}

const TaskDialog = ({ open, onOpenChange, task, groupId, onSave }: TaskDialogProps) => {
  const { groups, categories } = useTaskContext();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [recurring, setRecurring] = useState<RecurringType>('none');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [showMemberList, setShowMemberList] = useState(false);
  const [colorIndex, setColorIndex] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
  const [reminder, setReminder] = useState<Date | undefined>();
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [reminderHour, setReminderHour] = useState<string>('12');
  const [reminderMinute, setReminderMinute] = useState<string>('00');
  const [reminderPeriod, setReminderPeriod] = useState<'AM' | 'PM'>('AM');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  // const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  // Color palettes matching Flutter app
  const colorPalettes = [
    {
      name: 'Classic',
      colors: [
        '#E57373', '#F06292', '#BA68C8', '#64B5F6',
        '#81C784', '#4DB6AC', '#81C784', '#AED581',
        '#FFB74D', '#FFD54F', '#FF8A65', '#7986CB'
      ]
    },
    {
      name: 'Pastel',
      colors: [
        '#FFB3BA', '#FFDFBA', '#FFFBAA', '#BAFFC9',
        '#BAE1FF', '#D5BAFF', '#FFBAED', '#BAFFD9',
        '#FFE1BA', '#BAE1FF', '#D5FFBA', '#FFBAD5'
      ]
    },
    {
      name: 'Vibrant',
      colors: [
        '#FF5252', '#FFC107', '#4CAF50', '#2196F3',
        '#9C27B0', '#FF9800', '#00BCD4', '#8BC34A',
        '#FFEB3B', '#3F51B5', '#FF5722', '#009688'
      ]
    }
  ];

  const [selectedPalette, setSelectedPalette] = useState<number>(0);
  const [selectedColorInPalette, setSelectedColorInPalette] = useState<number>(0);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

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
  const handleReminderDateChange = (date: Date | null) => {
    if (date) {
      setReminderDate(date);
      setShowDatePicker(false);
      setShowTimePicker(true);
    } else {
      setReminderDate(null);
      setReminder(null);
      setReminder(undefined);
    }
  };

  // Time picker: set time, then combine with date
  // Custom time picker handlers
  const handleTimeConfirm = () => {
    if (reminderDate) {
      let hour = parseInt(reminderHour, 10);
      if (reminderPeriod === 'PM' && hour !== 12) hour += 12;
      if (reminderPeriod === 'AM' && hour === 12) hour = 0;
      const combined = new Date(reminderDate);
      combined.setHours(hour, parseInt(reminderMinute, 10), 0, 0);
      setReminder(combined);
    }
    setShowTimePicker(false);
  };
  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  const currentGroup = groupId ? groups.find(g => g.id === groupId) : null;
  const groupMembers = currentGroup ? Object.keys(currentGroup.members || {}) : [];

  // Fetch user profiles
  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (!groupMembers.length) return;
      
      const profiles = new Map<string, UserProfile>();
      await Promise.all(
        groupMembers.map(async (memberId) => {
          try {
            const profileDoc = await getDoc(doc(db, 'user_profiles', memberId));
            if (profileDoc.exists()) {
              profiles.set(memberId, { uid: memberId, ...profileDoc.data() } as UserProfile);
            } else {
              profiles.set(memberId, { uid: memberId });
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
            profiles.set(memberId, { uid: memberId });
          }
        })
      );
      setUserProfiles(profiles);
    };

    if (open && groupMembers.length > 0) {
      fetchUserProfiles();
    }
  }, [open, groupMembers.length]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setRecurring(task.recurring);
      setPriority(task.priority);
      // Load assigned members from groupMembers array, or default to userId for backwards compatibility
      setAssignedTo(task.groupMembers && task.groupMembers.length > 0 ? task.groupMembers : (task.userId ? [task.userId] : []));
      setColorIndex(task.colorIndex || 0);
      setCategoryId(task.categoryId || '');
      setTags(task.tags?.join(', ') || '');
      setSubtasks(task.subtasks || []);
      setReminder(task.reminder ? new Date(task.reminder) : undefined);
      // Calculate palette and color from colorIndex
      const paletteIdx = Math.floor((task.colorIndex || 0) / 12);
      const colorIdx = (task.colorIndex || 0) % 12;
      setSelectedPalette(Math.min(paletteIdx, 2));
      setSelectedColorInPalette(colorIdx);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setRecurring('none');
      setPriority('medium');
      setAssignedTo(user?.uid ? [user.uid] : []);
      // Random color index for new tasks
      const randomColorIdx = Math.floor(Math.random() * 36);
      setColorIndex(randomColorIdx);
      const paletteIdx = Math.floor(randomColorIdx / 12);
      const colorIdx = randomColorIdx % 12;
      setSelectedPalette(paletteIdx);
      setSelectedColorInPalette(colorIdx);
      setCategoryId('');
      setTags('');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setReminder(undefined);
    }
  }, [task, open, user]);

  const toggleMember = (memberId: string) => {
    setAssignedTo(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const removeMember = (memberId: string) => {
    setAssignedTo(prev => prev.filter(id => id !== memberId));
  };

  const getUserDisplay = (profile: UserProfile | undefined, memberId: string) => {
    if (!profile) return memberId.substring(0, 8);
    if (profile.displayName) return profile.displayName;
    if (profile.email) return profile.email.split('@')[0];
    if (currentGroup?.ownerId === memberId) return 'Owner';
    return 'Member';
  };

  const getUserInitials = (profile: UserProfile | undefined) => {
    if (profile?.displayName) {
      const parts = profile.displayName.split(' ');
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

  const handleSave = () => {
    if (!title.trim()) return;
    // Calculate colorIndex from palette and color selection
    const calculatedColorIndex = (selectedPalette * 12) + selectedColorInPalette;
    const selectedColor = colorPalettes[selectedPalette].colors[selectedColorInPalette];
    // Parse tags
    const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(t => t) : undefined;
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Store reminder as Firestore Timestamp (UTC) and IANA timezone
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate?.toISOString(),
      recurring,
      priority,
      groupId,
      groupMembers: groupId && assignedTo.length > 0 ? assignedTo : undefined,
      color: selectedColor,
      colorIndex: calculatedColorIndex,
      categoryId: categoryId.trim() || undefined,
      tags: tagsArray,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      reminder: reminder ? Timestamp.fromDate(reminder) : null,
      reminderTimezone: reminder ? browserTimezone : null,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{task ? 'Edit Task' : 'Create Task'}</SheetTitle>
        </SheetHeader>
        
        {/* Action Buttons at Top */}
        <div className="flex gap-2 py-4 border-b">
          <Button className="flex-1" onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              <span className={cn(
                "text-xs",
                title.length > 60 ? "text-destructive" : "text-muted-foreground"
              )}>
                {title.length}/60
              </span>
            </div>
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
            />
          </div>
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
                  // Check notification permission directly in click handler
                  if ('Notification' in window && user) {
                    console.log('Current permission:', Notification.permission);
                    
                    if (Notification.permission === 'default') {
                      // Request permission and register FCM token
                      try {
                        const permission = await Notification.requestPermission();
                        console.log('Permission result:', permission);
                        setNotificationPermission(permission);
                        
                        if (permission === 'granted') {
                          // Register FCM token for push notifications
                          await fcmService.requestPermissionAndGetToken(user.uid);
                          setShowDatePicker(true);
                        }
                      } catch (error) {
                        console.error('Error requesting permission:', error);
                      }
                    } else if (Notification.permission === 'granted') {
                      // Ensure FCM token is registered
                      const token = fcmService.getCurrentToken();
                      if (!token) {
                        await fcmService.requestPermissionAndGetToken(user.uid);
                      }
                      setShowDatePicker(true);
                    }
                    // If denied, the UI will show instructions
                  } else {
                    setShowDatePicker(true);
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
                  onClick={() => {
                    // When opening time picker, sync dropdowns with current reminder
                    if (reminder) {
                      let hour = reminder.getHours();
                      let period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
                      let hour12 = hour % 12;
                      if (hour12 === 0) hour12 = 12;
                      setReminderHour(hour12.toString().padStart(2, '0'));
                      setReminderMinute(reminder.getMinutes().toString().padStart(2, '0'));
                      setReminderPeriod(period);
                      setReminderDate(new Date(reminder));
                    }
                    setShowTimePicker(true);
                  }}
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

{/* Time Picker Dialog
<LocalizationProvider dateAdapter={AdapterDateFns}>
  <TimePicker
    open={showTimePicker}
    onClose={() => setShowTimePicker(false)}
    value={reminder}
    onChange={(time) => {
      if (reminder && time) {
        const newReminder = new Date(reminder);
        newReminder.setHours(time.getHours(), time.getMinutes(), 0, 0);
        setReminder(newReminder);
      }
    }}
    ampm
    // renderInput={(params) => <Input {...params} />}
  />
</LocalizationProvider> */}



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
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(min => (
                    <option key={min} value={min}>{min}</option>
                  ))}
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
                    const profile = userProfiles.get(memberId);
                    return (
                      <Badge key={memberId} variant="secondary" className="gap-1.5 pr-1">
                        <Avatar className="h-4 w-4">
                          {profile?.photoURL && <AvatarImage src={profile.photoURL} />}
                          <AvatarFallback className="text-[10px]">{getUserInitials(profile)}</AvatarFallback>
                        </Avatar>
                        <span>{memberId === user?.uid ? 'Me' : getUserDisplay(profile, memberId)}</span>
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
                {groupMembers.map(memberId => {
                  const profile = userProfiles.get(memberId);
                  const isSelected = assignedTo.includes(memberId);
                  const isOwner = currentGroup?.ownerId === memberId;
                  
                  return (
                    <div
                      key={memberId}
                      className={cn(
                        "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0",
                        isSelected && "bg-primary/5"
                      )}
                      onClick={() => toggleMember(memberId)}
                    >
                      <Checkbox checked={isSelected} />
                      <Avatar className="h-8 w-8">
                        {profile?.photoURL && <AvatarImage src={profile.photoURL} />}
                        <AvatarFallback className="text-xs">{getUserInitials(profile)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {memberId === user?.uid ? 'Me' : getUserDisplay(profile, memberId)}
                          {isOwner && <Badge variant="outline" className="ml-2 text-xs">Owner</Badge>}
                        </p>
                        {profile?.email && profile.displayName && (
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recurring</Label>
              <Select value={recurring} onValueChange={(v) => setRecurring(v as RecurringType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-2">
            <Label>Task Color</Label>
            <div className="space-y-3">
              {/* Palette Tabs */}
              <div className="flex gap-2">
                {colorPalettes.map((palette, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant={selectedPalette === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedPalette(idx);
                      setColorIndex((idx * 12) + selectedColorInPalette);
                    }}
                    className="flex-1"
                  >
                    {palette.name}
                  </Button>
                ))}
              </div>
              
              {/* Color Grid */}
              <div className="grid grid-cols-6 gap-2">
                {colorPalettes[selectedPalette].colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedColorInPalette(idx);
                      setColorIndex((selectedPalette * 12) + idx);
                    }}
                    className={cn(
                      "w-full aspect-square rounded-md border-2 transition-all hover:scale-110",
                      selectedColorInPalette === idx 
                        ? "border-foreground ring-2 ring-offset-2 ring-foreground" 
                        : "border-transparent hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: color }}
                    title={`Color ${idx + 1}`}
                  />
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Selected: {colorPalettes[selectedPalette].name} - Color {selectedColorInPalette + 1} (Index: {colorIndex})
              </p>
            </div>
          </div>

          {/* Category and Tags */}
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., urgent, meeting, review"
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDialog;
